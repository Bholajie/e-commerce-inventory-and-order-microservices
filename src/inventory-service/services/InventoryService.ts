import { Item, IItem } from '../domain/Item';
import { RabbitMQClient } from '../../shared/messaging/rabbitmq';
import { ElasticsearchLogger } from '../../shared/logging/elasticsearch';
import { EventTypes } from '../../shared/events/eventTypes';
import { StockEventEmitter } from '../../shared/events/inventory/stockEvents';

export class InventoryService {
  private rabbitmqClient: RabbitMQClient;
  private logger: ElasticsearchLogger;
  private stockEventEmitter: StockEventEmitter;

  constructor() {
    this.rabbitmqClient = RabbitMQClient.getInstance();
    this.logger = ElasticsearchLogger.getInstance();
    this.stockEventEmitter = StockEventEmitter.getInstance();
  }

  async addItem(itemData: Partial<IItem>): Promise<IItem> {
    const item = new Item(itemData);
    await item.save();
    
    await this.stockEventEmitter.emitStockUpdate({
      sku: item.sku,
      quantity: item.quantity,
      type: 'ADD'
    });

    await this.logger.log('inventory-events', {
      event: 'ITEM_ADDED',
      item: item.toJSON()
    });

    return item;
  }

  async updateStock(sku: string, quantity: number): Promise<IItem> {
    const item = await Item.findOne({ sku });
    if (!item) {
      throw new Error('Item not found');
    }

    const oldQuantity = item.quantity;
    item.quantity = quantity;
    await item.save();

    await this.stockEventEmitter.emitStockUpdate({
      sku,
      quantity,
      type: 'UPDATE'
    });

    await this.logger.log('inventory-events', {
      event: 'STOCK_UPDATED',
      sku,
      oldQuantity,
      newQuantity: quantity
    });

    return item;
  }

  async getItem(sku: string): Promise<IItem | null> {
    return Item.findOne({ sku });
  }

  async checkAndDeductStock(sku: string, quantity: number): Promise<boolean> {
    const item = await Item.findOne({ sku });
    if (!item || item.quantity < quantity) {
      return false;
    }

    const oldQuantity = item.quantity;
    item.quantity -= quantity;
    await item.save();

    await this.stockEventEmitter.emitStockUpdate({
      sku,
      quantity: item.quantity,
      type: 'REDUCE'
    });

    await this.logger.log('inventory-events', {
      event: 'STOCK_REDUCED',
      sku,
      oldQuantity,
      newQuantity: item.quantity,
      deducted: quantity
    });

    return true;
  }
}