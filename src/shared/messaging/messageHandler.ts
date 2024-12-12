import { Channel, ConsumeMessage } from 'amqplib';

export class MessageHandler {
  static async handleMessage(
    channel: Channel,
    msg: ConsumeMessage | null,
    handler: (content: any) => Promise<void>
  ): Promise<void> {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());
      await handler(content);
      await channel.ack(msg);
    } catch (error) {
      console.error('Error processing message:', error);
      // Reject the message and don't requeue it if it's unprocessable
      await channel.reject(msg, false);
    }
  }
}