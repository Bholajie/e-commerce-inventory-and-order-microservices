# Domain Models

## Stock Keeping Unit (SKU)

### Overview
A SKU (Stock Keeping Unit) is a unique identifier used to track and manage inventory items. It serves as a standardized way to identify products across the system.

### Format
```
TS-BLU-M-001
│  │   │  │
│  │   │  └─ Sequential number
│  │   └──── Size (Medium)
│  └──────── Color (Blue)
└────────── Product type (T-Shirt)
```

### Usage
- Inventory tracking
- Order processing
- Stock management
- Analytics and reporting

### Examples
- BOOK-HPT-HC: Harry Potter hardcover book
- SHOE-NIK-BK-42: Nike black shoes, size 42
- PHN-IPH-14-BLK: iPhone 14 in black

## Item Model
```typescript
interface IItem {
  name: string;      // Product name
  sku: string;       // Unique identifier
  price: number;     // Product price
  quantity: number;  // Available stock
}
```

## Order Model
```typescript
interface IOrder {
  orderNumber: string;  // Unique order ID
  sku: string;         // Product identifier
  quantity: number;    // Order quantity
  status: string;      // Order status
}
```

### Order Status Values
- PENDING: Initial state
- FULFILLED: Successfully processed
- FAILED: Processing failed