import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://bolajijohnson19:T0WaxJgkghBKP75v@cluster0.lwwhz.mongodb.net'
  },
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || 'amqp://localhost:5672'
  },
  elasticsearch: {
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'
  },
  port: process.env.PORT || 3000,
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003'
};