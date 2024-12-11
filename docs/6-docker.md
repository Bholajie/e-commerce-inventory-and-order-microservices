# 6. Docker Configuration Documentation

## Container Architecture

### Service Containers

#### 1. Inventory Service
```yaml
inventory-service:
  build: ./src/inventory-service
  ports: ["3001:3001"]
  environment:
    - MONGODB_URI
    - RABBITMQ_URI
    - ELASTICSEARCH_NODE
```

#### 2. Order Service
```yaml
order-service:
  build: ./src/order-service
  ports: ["3002:3002"]
  environment:
    - MONGODB_URI
    - RABBITMQ_URI
    - ELASTICSEARCH_NODE
```

### Infrastructure Containers

#### 1. RabbitMQ
```yaml
rabbitmq:
  image: rabbitmq:3-management
  ports: 
    - "5672:5672"    # AMQP protocol
    - "15672:15672"  # Management UI
```

#### 2. Elasticsearch
```yaml
elasticsearch:
  image: elasticsearch:8.9.0
  environment:
    - discovery.type=single-node
  ports: ["9200:9200"]
```

## Development Setup

### Prerequisites
1. Docker Desktop installed
2. Docker Compose installed
3. MongoDB Atlas account
4. Node.js 18+ (for local development)

### Running the Application
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up inventory-service

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Configuration
- `.env` file for local development
- Docker Compose environment variables
- Service-specific configurations

### Volume Management
- Elasticsearch data persistence
- Log storage
- Configuration mounting