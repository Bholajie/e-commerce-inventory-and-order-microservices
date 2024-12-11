# E-Commerce Inventory & Order Microservices

This project implements a microservices architecture for an e-commerce platform, focusing on inventory management and order processing.

## Architecture Overview

The system consists of two main microservices:

1. **Inventory Service**: Manages product inventory and stock levels
2. **Order Service**: Handles customer orders and coordinates with the inventory service

### Key Features

- Domain-Driven Design (DDD) principles
- Event-driven architecture using RabbitMQ
- MongoDB for persistent storage
- Elasticsearch for logging and monitoring
- Docker containerization
- Comprehensive testing suite

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- MongoDB
- RabbitMQ
- Elasticsearch

## Getting Started

1. Clone the repository
2. Start the services using Docker Compose:

```bash
docker-compose up
```

The following services will be available:

- Inventory Service: http://localhost:3003
- Order Service: http://localhost:3004
- RabbitMQ Management: http://localhost:15672
- Elasticsearch: http://localhost:9200

## API Documentation

### Inventory Service

#### Add New Item
```http
POST /api/inventory/items
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU123",
  "price": 29.99,
  "quantity": 100
}
```

#### Update Stock
```http
PUT /api/inventory/items/:sku/stock
Content-Type: application/json

{
  "quantity": 150
}
```

#### Get Item
```http
GET /api/inventory/items/:sku
```

### Order Service

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "sku": "SKU123",
  "quantity": 2
}
```

#### Get Order
```http
GET /api/orders/:orderNumber
```

## Testing

Run the test suite:

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## Design Decisions

1. **Event-Driven Communication**: Used RabbitMQ for asynchronous communication between services to ensure loose coupling.

2. **Domain-Driven Design**: 
   - Separate bounded contexts for Inventory and Orders
   - Rich domain models with business logic encapsulation
   - Clear separation of concerns between layers

3. **Logging Strategy**:
   - Centralized logging using Elasticsearch
   - Structured logging for better searchability
   - Event tracking for audit trails

4. **Error Handling**:
   - Graceful degradation
   - Comprehensive error messages
   - Proper HTTP status codes

## Project Structure

```
├── src/
│   ├── inventory-service/
│   │   ├── domain/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── routes/
│   ├── order-service/
│   │   ├── domain/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── routes/
│   └── shared/
│       ├── config/
│       ├── events/
│       ├── messaging/
│       └── logging/
├── tests/
├── docker-compose.yml
└── README.md
```