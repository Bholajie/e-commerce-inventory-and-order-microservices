# 3. Services Layer Explanation

## What are Services?
Services contain the business logic of our application. They:
1. Process business operations
2. Handle data validation
3. Coordinate between different parts of the system

## Example: Inventory Service

```typescript
// This service manages product inventory# 3. Services Layer Documentation

## Service Layer Implementation

### Inventory Service

#### InventoryService Class
```typescript
class InventoryService {
  // Core Operations
  async addItem(item: IItem)        // Add new product
  async updateStock(sku, quantity)  // Update stock level
  async getItem(sku)                // Retrieve item details
  async checkAndDeductStock(sku, quantity) // Process order
}
```

**Responsibilities**:
1. Stock management
2. Inventory updates
3. Stock level validation
4. Event emission

**Event Generation**:
- Stock added
- Stock updated
- Stock reduced

### Order Service

#### OrderService Class
```typescript
class OrderService {
  // Core Operations
  async createOrder(sku, quantity)  // Process new order
  async getOrder(orderNumber)       // Retrieve order details
}
```

**Responsibilities**:
1. Order processing
2. Stock availability check
3. Order status management
4. Event handling

**Event Handling**:
- Listen for stock updates
- Process order status changes
- Log order events

## Service Communication
- Event-based using RabbitMQ
- REST API calls for synchronous operations
- Elasticsearch for logging and monitoring
class InventoryService {
  // Add a new product to inventory
  async addItem(item) {
    // Validate item data
    // Save to database
    // Notify other services
  }

  // Update product stock
  async updateStock(sku, quantity) {
    // Find product
    // Update quantity
    // Send stock update event
  }
}
```

## Example: Order Service

```typescript
// This service handles customer orders
class OrderService {
  // Create a new order
  async createOrder(sku, quantity) {
    // Check stock availability
    // Create order record
    // Update inventory
    // Send order confirmation
  }
}
```