import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { RabbitMQClient } from '../shared/messaging/rabbitmq';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Setup MongoDB
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  // Setup RabbitMQ
  const rabbitmqClient = RabbitMQClient.getInstance();
  await rabbitmqClient.connect();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  
  const rabbitmqClient = RabbitMQClient.getInstance();
  await rabbitmqClient.close();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});