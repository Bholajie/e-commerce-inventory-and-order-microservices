import { OrderService } from '../OrderService';
import { Order } from '../../domain/Order';
import axios from 'axios';
import { RabbitMQClient } from '../../../shared/messaging/rabbitmq';
import { ElasticsearchLogger } from '../../../shared/logging/elasticsearch';

jest.mock('axios');
jest.mock('../../../shared/messaging/rabbitmq');
jest.mock('../../../shared/logging/elasticsearch');

describe('OrderService', () => {
  let orderService: OrderService;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(() => {
    orderService = new OrderService();
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a fulfilled order when stock is available', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { available: true } });

      const result = await orderService.createOrder('TEST-123', 2);

      expect(result.status).toBe('FULFILLED');
      expect(result.sku).toBe('TEST-123');
      expect(result.quantity).toBe(2);

      const savedOrder = await Order.findOne({ orderNumber: result.orderNumber });
      expect(savedOrder).toBeTruthy();
      expect(savedOrder?.status).toBe('FULFILLED');
    });

    it('should create a failed order when stock is unavailable', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { available: false } });

      const result = await orderService.createOrder('TEST-123', 2);

      expect(result.status).toBe('FAILED');
      expect(result.sku).toBe('TEST-123');
      expect(result.quantity).toBe(2);

      const savedOrder = await Order.findOne({ orderNumber: result.orderNumber });
      expect(savedOrder).toBeTruthy();
      expect(savedOrder?.status).toBe('FAILED');
    });

    it('should handle service errors gracefully', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Service unavailable'));

      const result = await orderService.createOrder('TEST-123', 2);

      expect(result.status).toBe('FAILED');
      expect(result.sku).toBe('TEST-123');
      expect(result.quantity).toBe(2);

      const savedOrder = await Order.findOne({ orderNumber: result.orderNumber });
      expect(savedOrder).toBeTruthy();
      expect(savedOrder?.status).toBe('FAILED');
    });
  });

  describe('getOrder', () => {
    it('should retrieve an existing order', async () => {
      const order = await Order.create({
        orderNumber: 'ORD-123',
        sku: 'TEST-123',
        quantity: 2,
        status: 'FULFILLED'
      });

      const result = await orderService.getOrder(order.orderNumber);

      expect(result).toBeTruthy();
      expect(result?.orderNumber).toBe(order.orderNumber);
      expect(result?.status).toBe('FULFILLED');
    });

    it('should return null for non-existent order', async () => {
      const result = await orderService.getOrder('NON-EXISTENT');

      expect(result).toBeNull();
    });
  });
});