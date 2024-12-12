import express from 'express';
import mongoose from 'mongoose';
import { config } from '../shared/config';
import inventoryRoutes from './routes';
import { RabbitMQClient } from '../shared/messaging/rabbitmq';
import { findAvailablePort } from '../shared/utils/portUtils';

const app = express();

app.use(express.json());
app.use('/api/inventory', inventoryRoutes);

export { app }; // Export for testing

async function startServer() {
  try {
    // Connect to MongoDB with specific database for Inventory Service
    const dbUri = `${config.mongodb.uri}/${process.env.INVENTORY_DB}`;
    console.log('Connecting to database:', dbUri);
    
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB - Inventory Service');

    // Connect to RabbitMQ
    const rabbitmqClient = RabbitMQClient.getInstance();
    await rabbitmqClient.connect();
    console.log('Connected to RabbitMQ');

    // Find available port
    const port = await findAvailablePort(
      config.services.inventory.port,
      config.services.inventory.fallbackPorts
    );

    // Start the server
    app.listen(port, () => {
      console.log(`Inventory service listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}