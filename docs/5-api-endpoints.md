# 5. API Endpoints Documentation

## REST API Implementation

### Inventory Service API (Port 3001)

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

Response: 201 Created
{
  "id": "...",
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

Response: 200 OK
{
  "sku": "SKU123",
  "quantity": 150
}
```

#### Get Item
```http
GET /api/inventory/items/:sku

Response: 200 OK
{
  "id": "...",
  "name": "Product Name",
  "sku": "SKU123",
  "price": 29.99,
  "quantity": 150
}
```

### Order Service API (Port 3002)

#### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "sku": "SKU123",
  "quantity": 2
}

Response: 201 Created
{
  "orderNumber": "ORD123",
  "sku": "SKU123",
  "quantity": 2,
  "status": "PENDING"
}
```

#### Get Order
```http
GET /api/orders/:orderNumber

Response: 200 OK
{
  "orderNumber": "ORD123",
  "sku": "SKU123",
  "quantity": 2,
  "status": "FULFILLED"
}
```

### Error Responses
```http
400 Bad Request
{
  "error": "Invalid input"
}

404 Not Found
{
  "error": "Resource not found"
}

500 Internal Server Error
{
  "error": "Internal server error"
}
```