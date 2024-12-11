import { Request, Response } from "express";
import { InventoryService } from "../services/InventoryService";

export class InventoryController {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  async addItem(req: Request, res: Response): Promise<void> {
    try {
      const item = await this.inventoryService.addItem(req.body);
      res.status(201).json(item);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred" });
      }
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { sku, quantity } = req.body;
      const item = await this.inventoryService.updateStock(sku, quantity);
      res.json(item);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred" });
      }
    }
  }

  async getItem(req: Request, res: Response): Promise<void> {
    try {
      const { sku } = req.params;
      const item = await this.inventoryService.getItem(sku);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.json(item);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred" });
      }
    }
  }

  async checkStock(req: Request, res: Response): Promise<void> {
    const { sku, quantity } = req.body;

    try {
      const item = await this.inventoryService.checkAndDeductStock(
        sku,
        quantity
      );
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      res.json(item);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unexpected error occurred" });
      }
    }
  }
}
