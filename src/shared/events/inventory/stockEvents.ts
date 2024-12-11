import { RabbitMQClient } from '../../messaging/rabbitmq';
import { ElasticsearchLogger } from '../../logging/elasticsearch';

export interface StockUpdateEvent {
  sku: string;
  quantity: number;
  type: 'ADD' | 'REDUCE' | 'UPDATE';
  timestamp: Date;
}

export class StockEventEmitter {
  private static instance: StockEventEmitter;
  private rabbitmqClient: RabbitMQClient;
  private logger: ElasticsearchLogger;

  private constructor() {
    this.rabbitmqClient = RabbitMQClient.getInstance();
    this.logger = ElasticsearchLogger.getInstance();
  }

  public static getInstance(): StockEventEmitter {
    if (!StockEventEmitter.instance) {
      StockEventEmitter.instance = new StockEventEmitter();
    }
    return StockEventEmitter.instance;
  }

  async emitStockUpdate(event: Omit<StockUpdateEvent, 'timestamp'>): Promise<void> {
    const fullEvent: StockUpdateEvent = {
      ...event,
      timestamp: new Date()
    };

    // Publish to RabbitMQ
    await this.rabbitmqClient.publishEvent(
      'inventory',
      'stock.updated',
      fullEvent
    );

    // Log to Elasticsearch
    await this.logger.log('inventory-stock-events', fullEvent);
  }
}