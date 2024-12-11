import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { sku, quantity } = req.body;
      const order = await this.orderService.createOrder(sku, quantity);
      res.status(201).json(order);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const order = await this.orderService.getOrder(orderNumber);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json(order);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'An unexpected error occurred' });
      }
    }
  }
}