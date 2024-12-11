# 4. Event-Based Communication Documentation

## Message Broker Implementation

### RabbitMQ Configuration

#### Connection Setup
```typescript
class RabbitMQClient {
  private connection: Connection;
  private channel: Channel;
  
  async connect()  // Establish connection
  async close()    // Clean up resources
}
```

### Event Types

#### Stock Events
```typescript
interface StockUpdateEvent {
  sku: string;      // Product identifier
  quantity: number; // New stock level
  type: 'ADD' | 'REDUCE' | 'UPDATE';
  timestamp: Date;  // Event time
}
```

#### Order Events
```typescript
interface OrderEvent {
  orderNumber: string;
  status: string;
  timestamp: Date;
}
```

### Event Flow

1. **Stock Updates**:
   - Inventory service emits events
   - Order service subscribes
   - Events logged to Elasticsearch

2. **Order Processing**:
   - Order creation triggers stock check
   - Stock deduction emits event
   - Order status updated based on result

### Benefits
1. Loose coupling between services
2. Reliable message delivery
3. Scalable architecture
4. Event persistence
5. Monitoring capabilities