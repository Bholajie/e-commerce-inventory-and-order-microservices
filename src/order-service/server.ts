import express from 'express';
import mongoose from 'mongoose';
import { config } from '../shared/config';
import orderRoutes from './routes';
import { RabbitMQClient } from '../shared/messaging/rabbitmq';

const app = express();

app.use(express.json());
app.use('/api/orders', orderRoutes);

export { app }; // Export for testing

async function startServer() {
  try {
    // Connect to MongoDB with specific database for Order Service
    const dbUri = `${config.mongodb.uri}/${process.env.ORDER_DB}`;
    console.log('Connecting to database:', dbUri);
    
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB - Order Service');

    // Connect to RabbitMQ
    const rabbitmqClient = RabbitMQClient.getInstance();
    await rabbitmqClient.connect();
    console.log('Connected to RabbitMQ');

    // Start the server
    // const port = process.env.PORT || process.env.ORDER_SERVICE_PORT || 3004;
    const port = process.env.ORDER_SERVICE_PORT || 3004;
    app.listen(port, () => {
      console.log(`Order service listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}
