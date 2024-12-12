import axios from 'axios';
import { config } from '../../shared/config';

export class InventoryClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.inventoryServiceUrl;
  }

  async checkStock(sku: string, quantity: number): Promise<boolean> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/inventory/check-stock`,
        { sku, quantity }
      );
      return response.data.available;
    } catch (error) {
      console.error('Error checking stock:', error);
      throw error;
    }
  }
}