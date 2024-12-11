import { InventoryService } from '../../inventory-service/services/InventoryService';
import { OrderService } from '../../order-service/services/OrderService';
import { Item } from '../../inventory-service/domain/Item';
import { Order } from '../../order-service/domain/Order';

describe('Order-Inventory Integration', () => {
  let inventoryService: InventoryService;
  let orderService: OrderService;

  beforeEach(() => {
    inventoryService = new InventoryService();
    orderService = new OrderService();
  });

  it('should successfully create order when stock is available', async () => {
    // Add item to inventory
    const item = await inventoryService.addItem({
      name: 'Test Product',
      sku: 'TEST-INT-123',
      price: 29.99,
      quantity: 10
    });

    // Create order
    const order = await orderService.createOrder(item.sku, 2);

    // Verify order status
    expect(order.status).toBe('FULFILLED');

    // Verify stock was deducted
    const updatedItem = await Item.findOne({ sku: item.sku });
    expect(updatedItem?.quantity).toBe(8);
  });

  it('should fail order creation when insufficient stock', async () => {
    // Add item to inventory with low stock
    const item = await inventoryService.addItem({
      name: 'Test Product',
      sku: 'TEST-INT-123',
      price: 29.99,
      quantity: 1
    });

    // Attempt to create order with higher quantity
    const order = await orderService.createOrder(item.sku, 2);

    // Verify order status
    expect(order.status).toBe('FAILED');

    // Verify stock remained unchanged
    const unchangedItem = await Item.findOne({ sku: item.sku });
    expect(unchangedItem?.quantity).toBe(1);
  });

  it('should handle concurrent orders correctly', async () => {
    // Add item to inventory
    const item = await inventoryService.addItem({
      name: 'Test Product',
      sku: 'TEST-INT-123',
      price: 29.99,
      quantity: 10
    });

    // Create multiple orders concurrently
    const orderPromises = Array(5).fill(null).map(() => 
      orderService.createOrder(item.sku, 2)
    );

    const orders = await Promise.all(orderPromises);

    // Count fulfilled orders
    const fulfilledOrders = orders.filter(order => order.status === 'FULFILLED');
    expect(fulfilledOrders.length).toBe(5);

    // Verify final stock
    const finalItem = await Item.findOne({ sku: item.sku });
    expect(finalItem?.quantity).toBe(0);
  });
});