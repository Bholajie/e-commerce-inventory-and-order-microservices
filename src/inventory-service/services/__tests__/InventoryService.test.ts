import { InventoryService } from '../InventoryService';
import { Item } from '../../domain/Item';
import { RabbitMQClient } from '../../../shared/messaging/rabbitmq';
import { ElasticsearchLogger } from '../../../shared/logging/elasticsearch';

jest.mock('../../../shared/messaging/rabbitmq');
jest.mock('../../../shared/logging/elasticsearch');

describe('InventoryService', () => {
  let inventoryService: InventoryService;

  beforeEach(() => {
    inventoryService = new InventoryService();
  });

  describe('addItem', () => {
    it('should create a new item and emit stock update event', async () => {
      const itemData = {
        name: 'Test Item',
        sku: 'TEST-123',
        price: 29.99,
        quantity: 100
      };

      const result = await inventoryService.addItem(itemData);

      expect(result.name).toBe(itemData.name);
      expect(result.sku).toBe(itemData.sku);
      expect(result.price).toBe(itemData.price);
      expect(result.quantity).toBe(itemData.quantity);

      const savedItem = await Item.findOne({ sku: itemData.sku });
      expect(savedItem).toBeTruthy();
      expect(savedItem?.name).toBe(itemData.name);
    });
  });

  describe('updateStock', () => {
    it('should update item stock and emit update event', async () => {
      const item = await Item.create({
        name: 'Test Item',
        sku: 'TEST-123',
        price: 29.99,
        quantity: 100
      });

      const newQuantity = 150;
      const result = await inventoryService.updateStock(item.sku, newQuantity);

      expect(result.quantity).toBe(newQuantity);

      const updatedItem = await Item.findOne({ sku: item.sku });
      expect(updatedItem?.quantity).toBe(newQuantity);
    });

    it('should throw error for non-existent item', async () => {
      await expect(
        inventoryService.updateStock('NON-EXISTENT', 100)
      ).rejects.toThrow('Item not found');
    });
  });

  describe('checkAndDeductStock', () => {
    it('should deduct stock when available', async () => {
      const item = await Item.create({
        name: 'Test Item',
        sku: 'TEST-123',
        price: 29.99,
        quantity: 100
      });

      const deductQuantity = 50;
      const result = await inventoryService.checkAndDeductStock(item.sku, deductQuantity);

      expect(result).toBe(true);

      const updatedItem = await Item.findOne({ sku: item.sku });
      expect(updatedItem?.quantity).toBe(50);
    });

    it('should return false when insufficient stock', async () => {
      const item = await Item.create({
        name: 'Test Item',
        sku: 'TEST-123',
        price: 29.99,
        quantity: 10
      });

      const result = await inventoryService.checkAndDeductStock(item.sku, 20);

      expect(result).toBe(false);

      const unchangedItem = await Item.findOne({ sku: item.sku });
      expect(unchangedItem?.quantity).toBe(10);
    });
  });
});