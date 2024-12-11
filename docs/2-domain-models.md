# 2. Domain Models Documentation

## Domain-Driven Design (DDD) Implementation

### Inventory Domain

#### Item Model (IItem)
```typescript
interface IItem {
  name: string;      // Product name (e.g., "Blue T-Shirt")
  sku: string;       // Stock Keeping Unit (e.g., "TS-BLUE-001")
  price: number;     // Product price (e.g., 29.99)
  quantity: number;  // Available stock (e.g., 100)
}
```

**Business Rules**:
- SKU must be unique
- Quantity cannot be negative
- Price must be positive
- Name is required

### Order Domain

#### Order Model (IOrder)
```typescript
interface IOrder {
  orderNumber: string;  // Unique identifier (e.g., "ORD-2023-001")
  sku: string;         // Referenced product SKU
  quantity: number;    // Order quantity
  status: string;      // Current status
}
```

**Status Values**:
- PENDING: Initial state
- FULFILLED: Successfully processed
- FAILED: Processing failed

**Business Rules**:
- Order number must be unique
- Quantity must be positive
- SKU must reference existing inventory item
- Status transitions must follow defined flow

## Model Relationships
- Orders reference inventory items through SKU
- Stock updates affect order fulfillment
- Status changes trigger events