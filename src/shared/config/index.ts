import dotenv from 'dotenv';

dotenv.config();

const findAvailablePort = (preferredPort: number): number => {
  return preferredPort + Math.floor(Math.random() * 100);
};

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017'
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672'
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
  },
  services: {
    inventory: {
      port: parseInt(process.env.INVENTORY_SERVICE_PORT || '3003', 10),
      fallbackPorts: [3013, 3023, 3033]
    },
    order: {
      port: parseInt(process.env.ORDER_SERVICE_PORT || '3004', 10),
      fallbackPorts: [3014, 3024, 3034]
    }
  },
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003'
};