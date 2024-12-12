import amqp, { Channel, Connection } from 'amqplib';
import { config } from '../config';
import { MessageHandler } from './messageHandler';

export class RabbitMQClient {
  private static instance: RabbitMQClient;
  private connection?: Connection;
  private channel?: Channel;
  private connected: boolean = false;

  private constructor() {}

  public static getInstance(): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient();
    }
    return RabbitMQClient.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      this.connection = await amqp.connect(config.rabbitmq.uri);
      this.channel = await this.connection.createChannel();
      this.connected = true;

      // Handle connection errors
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.connected = false;
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.connected = false;
      });
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      this.connected = false;
      throw error;
    }
  }

  async publishEvent(exchange: string, routingKey: string, message: any): Promise<void> {
    if (!this.channel || !this.connected) {
      await this.connect();
    }

    try {
      await this.channel!.assertExchange(exchange, 'topic', { durable: true });
      this.channel!.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  async subscribeToEvent(
    exchange: string,
    routingKey: string,
    queue: string,
    handler: (message: any) => Promise<void>
  ): Promise<void> {
    if (!this.channel || !this.connected) {
      await this.connect();
    }

    try {
      await this.channel!.assertExchange(exchange, 'topic', { durable: true });
      await this.channel!.assertQueue(queue, { durable: true });
      await this.channel!.bindQueue(queue, exchange, routingKey);

      await this.channel!.prefetch(1); // Process one message at a time

      this.channel!.consume(queue, async (msg) => {
        await MessageHandler.handleMessage(this.channel!, msg, handler);
      });
    } catch (error) {
      console.error('Error setting up subscription:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.connected = false;
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
}