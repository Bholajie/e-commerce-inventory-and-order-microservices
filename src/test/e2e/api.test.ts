import request from 'supertest';
import { app as inventoryApp } from '../../inventory-service/server';
import { app as orderApp } from '../../order-service/server';
import { Item } from '../../inventory-service/domain/Item';
import { Order } from '../../order-service/domain/Order';

describe('API E2E Tests', () => {
  describe('Inventory Service', () => {
    it('should create new item', async () => {
      const response = await request(inventoryApp)
        .post('/api/inventory/items')
        .send({
          name: 'Test Product',
          sku: 'TEST-E2E-123',
          price: 29.99,
          quantity: 100
        });

      expect(response.status).toBe(201);
      expect(response.body.sku).toBe('TEST-E2E-123');
      expect(response.body.quantity).toBe(100);
    });

    it('should update stock', async () => {
      const item = await Item.create({
        name: 'Test Product',
        sku: 'TEST-E2E-123',
        price: 29.99,
        quantity: 100
      });

      const response = await request(inventoryApp)
        .put(`/api/inventory/items/${item.sku}/stock`)
        .send({ quantity: 150 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(150);
    });
  });

  describe('Order Service', () => {
    it('should create order and update inventory', async () => {
      // First create item in inventory
      const item = await Item.create({
        name: 'Test Product',
        sku: 'TEST-E2E-123',
        price: 29.99,
        quantity: 100
      });

      // Create order
      const orderResponse = await request(orderApp)
        .post('/api/orders')
        .send({
          sku: item.sku,
          quantity: 2
        });

      expect(orderResponse.status).toBe(201);
      expect(orderResponse.body.status).toBe('FULFILLED');

      // Verify inventory was updated
      const updatedItem = await Item.findOne({ sku: item.sku });
      expect(updatedItem?.quantity).toBe(98);
    });

    it('should get order details', async () => {
      const order = await Order.create({
        orderNumber: 'ORD-E2E-123',
        sku: 'TEST-E2E-123',
        quantity: 2,
        status: 'FULFILLED'
      });

      const response = await request(orderApp)
        .get(`/api/orders/${order.orderNumber}`);

      expect(response.status).toBe(200);
      expect(response.body.orderNumber).toBe('ORD-E2E-123');
      expect(response.body.status).toBe('FULFILLED');
    });
  });
});