import { v4 as uuidv4 } from 'uuid';
import { Order, IOrder } from '../domain/Order';
import { RabbitMQClient } from '../../shared/messaging/rabbitmq';
import { ElasticsearchLogger } from '../../shared/logging/elasticsearch';
import { EventTypes } from '../../shared/events/eventTypes';
import axios from 'axios';
import { config } from '../../shared/config';
import { StockUpdateEvent } from '../../shared/events/inventory/stockEvents';

export class OrderService {
  private rabbitmqClient: RabbitMQClient;
  private logger: ElasticsearchLogger;

  constructor() {
    this.rabbitmqClient = RabbitMQClient.getInstance();
    this.logger = ElasticsearchLogger.getInstance();
    this.setupStockEventListener();
  }

  private async setupStockEventListener(): Promise<void> {
    await this.rabbitmqClient.subscribeToEvent(
      'inventory',
      'stock.updated',
      'order-service-stock-updates',
      async (event: StockUpdateEvent) => {
        await this.logger.log('order-stock-updates', {
          message: 'Stock update received',
          ...event
        });
      }
    );
  }

  async createOrder(sku: string, quantity: number): Promise<IOrder> {
    const orderNumber = uuidv4();
    const order = new Order({
      orderNumber,
      sku,
      quantity,
      status: 'PENDING'
    });

    await order.save();

    try {
      const response = await axios.post(
        `${config.inventoryServiceUrl}/api/inventory/check-stock`,
        { sku, quantity }
      );

      if (response.data.available) {
        order.status = 'FULFILLED';
        await this.rabbitmqClient.publishEvent(
          'orders',
          EventTypes.ORDER_FULFILLED,
          { orderNumber, sku, quantity }
        );
      } else {
        order.status = 'FAILED';
        await this.rabbitmqClient.publishEvent(
          'orders',
          EventTypes.ORDER_FAILED,
          { orderNumber, reason: 'Insufficient stock' }
        );
      }
    } catch (error) {
      order.status = 'FAILED';
      await this.rabbitmqClient.publishEvent(
        'orders',
        EventTypes.ORDER_FAILED,
        { orderNumber, reason: 'Service error' }
      );
    }

    await order.save();
    await this.logger.log('order-events', {
      event: 'ORDER_CREATED',
      order: order.toJSON()
    });

    return order;
  }

  async getOrder(orderNumber: string): Promise<IOrder | null> {
    return Order.findOne({ orderNumber });
  }
}