import { IOrder } from '../domain/Order';
import { RabbitMQClient } from '../../shared/messaging/rabbitmq';
import { ElasticsearchLogger } from '../../shared/logging/elasticsearch';
import { EventTypes } from '../../shared/events/eventTypes';

export class OrderEventEmitter {
  private static instance: OrderEventEmitter;
  private rabbitmqClient: RabbitMQClient;
  private logger: ElasticsearchLogger;

  constructor() {
    this.rabbitmqClient = RabbitMQClient.getInstance();
    this.logger = ElasticsearchLogger.getInstance();
  }

  public static getInstance(): OrderEventEmitter {
    if (!OrderEventEmitter.instance) {
      OrderEventEmitter.instance = new OrderEventEmitter();
    }
    return OrderEventEmitter.instance;
  }

  async emitOrderFulfilled(order: IOrder): Promise<void> {
    await this.rabbitmqClient.publishEvent(
      'orders',
      EventTypes.ORDER_FULFILLED,
      {
        orderNumber: order.orderNumber,
        sku: order.sku,
        quantity: order.quantity
      }
    );
  }

  async emitOrderFailed(order: IOrder, reason: string): Promise<void> {
    await this.rabbitmqClient.publishEvent(
      'orders',
      EventTypes.ORDER_FAILED,
      {
        orderNumber: order.orderNumber,
        reason
      }
    );
  }
}