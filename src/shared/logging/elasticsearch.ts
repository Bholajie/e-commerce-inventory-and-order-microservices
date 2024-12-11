import { Client } from '@elastic/elasticsearch';
import { config } from '../config';

export class ElasticsearchLogger {
  private static instance: ElasticsearchLogger;
  private client: Client;

  private constructor() {
    this.client = new Client({
      node: config.elasticsearch.node
    });
  }

  public static getInstance(): ElasticsearchLogger {
    if (!ElasticsearchLogger.instance) {
      ElasticsearchLogger.instance = new ElasticsearchLogger();
    }
    return ElasticsearchLogger.instance;
  }

  async log(index: string, document: any): Promise<void> {
    try {
      await this.client.index({
        index,
        document: {
          ...document,
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('Error logging to Elasticsearch:', error);
    }
  }
}