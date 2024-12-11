# 1. Project Structure Documentation

## Directory Structure
```
src/
├── shared/           # Shared utilities and common code
│   ├── config/       # Configuration management
│   ├── events/       # Event definitions and handlers
│   ├── messaging/    # Message broker (RabbitMQ) integration
│   └── logging/      # Logging utilities (Elasticsearch)
├── inventory-service/# Inventory management service
│   ├── domain/       # Business entities and interfaces
│   ├── services/     # Business logic implementation
│   ├── controllers/  # HTTP request handlers
│   ├── routes/       # API endpoint definitions
│   ├── Dockerfile    # Container configuration
│   └── server.ts     # Service entry point
└── order-service/    # Order processing service
    ├── domain/       # Order-related entities
    ├── services/     # Order processing logic
    ├── controllers/  # HTTP request handlers
    ├── routes/       # API endpoint definitions
    ├── Dockerfile    # Container configuration
    └── server.ts     # Service entry point

## Shared Components (/src/shared)

### Config (/config)
- Environment variable management
- Service configuration (ports, URLs)
- Database connection settings

### Events (/events)
- Event type definitions
- Event emitters and handlers
- Stock update events
- Order status events

### Messaging (/messaging)
- RabbitMQ client implementation
- Message publishing utilities
- Event subscription handlers
- Queue management

### Logging (/logging)
- Elasticsearch integration
- Structured logging utilities
- Event tracking and monitoring

## Service-Specific Components

### Inventory Service
- **Domain**: Item model and interfaces
- **Services**: Stock management logic
- **Controllers**: REST API handlers
- **Routes**: API endpoint definitions
- **Server**: Service bootstrapping

### Order Service
- **Domain**: Order model and interfaces
- **Services**: Order processing logic
- **Controllers**: REST API handlers
- **Routes**: API endpoint definitions
- **Server**: Service bootstrapping