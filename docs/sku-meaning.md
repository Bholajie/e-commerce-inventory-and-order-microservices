SKU (Stock Keeping Unit) is a unique identifier used in inventory management and retail to track and manage products. Let me explain it in detail:

What is SKU?
Definition:

A SKU is a unique code assigned to a product
It helps identify and track inventory items
Think of it as a product's "fingerprint"
Example Format:


TS-BLU-M-001
│  │   │  │
│  │   │  └─ Sequential number
│  │   └──── Size (Medium)
│  └──────── Color (Blue)
└────────── Product type (T-Shirt)
Real-World Examples:

BOOK-HPT-HC: Harry Potter hardcover book
SHOE-NIK-BK-42: Nike black shoes, size 42
PHN-IPH-14-BLK: iPhone 14 in black
Why Use SKUs?
Inventory Management:

Track stock levels accurately
Identify low stock items
Manage reordering
Order Processing:

Match orders to specific products
Prevent fulfillment errors
Track order status
Analytics:

Monitor product performance
Track sales patterns
Analyze inventory turnover
In our microservices application, SKUs are used to:

Uniquely identify products in the inventory service
Reference specific products in orders
Track stock updates and availability
Link orders to inventory items
This is why you see sku as a key field in both the IItem and IOrder interfaces in our domain models.