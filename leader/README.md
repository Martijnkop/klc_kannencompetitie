# Leader Project - Product Sales API

A Node.js Express API that bridges a read-only barboek database with a new product management database, featuring product sales tracking and dynamic product discovery.

## Project Setup

### Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000

# Read-only Barboek Database
BARBOEK_HOST=localhost
BARBOEK_USER=username
BARBOEK_PASSWORD=password
BARBOEK_NAME=barboek_database_name

# New Product Database
DB_HOST=localhost
DB_USER=username
DB_PASSWORD=password
DB_NAME=new_database_name
```

### Installation

```bash
npm install
```

## Database Schema

### Read-Only Database (BARBOEK)

Contains `product_sales_simplified` table with the following columns:
- `product_name` (varchar(100), NOT NULL)
- `product_id` (int, NOT NULL)
- `product_amount` (decimal(10,4), NOT NULL)
- `product_price_paid` (decimal(10,4), nullable)
- `lid_naam` (varchar(255), nullable)
- `transaction_timestamp` (datetime) - used for filtering sales by date

### New Database

#### Products Table

Create this table using the `/api/init` endpoint or manually:

```sql
CREATE TABLE IF NOT EXISTS products (
  product_id INT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  multiplier DECIMAL(3,0) DEFAULT 1 NOT NULL CHECK (multiplier >= 0 AND multiplier <= 127)
);
```

#### Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  lid_naam VARCHAR(255) PRIMARY KEY,
  group_id INT,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);
```

**Columns:**
- `lid_naam` - Unique user identifier (from barboek database)
- `group_id` - Optional reference to a group

#### Groups Table

```sql
CREATE TABLE IF NOT EXISTS groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);
```

**Columns:**
- `id` - Auto-incrementing group identifier
- `name` - Unique group name

## Project Structure

```
.
├── index.js                    # Main server file
├── package.json               # Dependencies
├── .env                        # Environment variables
├── ProductSalesSimplified.js   # Class for barboek product sales data
├── Product.js                  # Class for product management
├── User.js                     # Class for user management
├── Group.js                    # Class for group management
├── productSalesRoutes.js       # Endpoints for fetching product sales
├── productRoutes.js            # Endpoints for product management
├── userRoutes.js               # Endpoints for user management
├── groupRoutes.js              # Endpoints for group management
├── schemaRoutes.js             # Endpoint for database schema inspection
├── initRoutes.js               # Endpoint for database initialization
└── README.md                   # This file
```

## API Endpoints

### Initialization

#### `POST /api/init`
Initialize the database schema (creates the products table if it doesn't exist).

**Response:**
```json
{
  "message": "Database initialization complete",
  "results": [
    {
      "status": "success",
      "statement": "CREATE TABLE IF NOT EXISTS products..."
    }
  ]
}
```

---

### Product Sales (Read-Only Database)

#### `GET /api/product-sales?since=YYYY-MM-DDTHH:MM:SS`
Retrieve all product sales from the barboek database since a specific date and time.

**Query Parameters:**
- `since` (required) - ISO 8601 datetime format
  - Supports: `2026-03-30T15:30:00` or `2026-03-30 15:30:00`

**Response:**
```json
{
  "count": 2,
  "data": [
    {
      "product_name": "Bier (glas)",
      "product_id": 139,
      "product_amount": "3.0000",
      "product_price_paid": "3.0000",
      "lid_naam": "DiSC van der Lid"
    },
    {
      "product_name": "Pepsi",
      "product_id": 25,
      "product_amount": "2.0000",
      "product_price_paid": "2.0000",
      "lid_naam": "DiSC van der Lid"
    }
  ]
}
```

**Important:** This endpoint automatically discovers new products from the barboek database and adds them to the products table with a default multiplier of 1.

---

### Product Management (New Database)

#### `GET /api/products`
Get all products from the new database.

**Response:**
```json
{
  "count": 2,
  "data": [
    {
      "product_id": 139,
      "product_name": "Bier (glas)",
      "multiplier": 1
    },
    {
      "product_id": 25,
      "product_name": "Pepsi",
      "multiplier": 1
    }
  ]
}
```

---

#### `GET /api/products/:id`
Get a specific product by ID.

**Parameters:**
- `id` - Product ID

**Response:**
```json
{
  "product_id": 139,
  "product_name": "Bier (glas)",
  "multiplier": 1
}
```

**Error Response (404):**
```json
{
  "error": "Product not found"
}
```

---

#### `PUT /api/products/:id/multiplier`
Update a product's multiplier value.

**Parameters:**
- `id` - Product ID

**Request Body:**
```json
{
  "multiplier": 2.5
}
```

**Validation:**
- Multiplier must be a number between 0 and 127

**Response:**
```json
{
  "message": "Multiplier updated successfully",
  "product": {
    "product_id": 139,
    "product_name": "Bier (glas)",
    "multiplier": 2.5
---

### User Management (New Database)

#### `GET /api/users`
Get all users from the database.

**Response:**
```json
{
  "count": 2,
  "data": [
    {
      "lid_naam": "DiSC van der Lid",
      "group_id": 1
    },
    {
      "lid_naam": "Another User",
      "group_id": null
    }
  ]
}
```

---

#### `GET /api/users/:lid_naam`
Get a specific user by their identifier (lid_naam).

**Parameters:**
- `lid_naam` - User identifier

**Response:**
```json
{
  "lid_naam": "DiSC van der Lid",
  "group_id": 1
}
```

**Error Response (404):**
```json
{
  "error": "User not found"
}
```

---

#### `POST /api/users`
Create a new user.

**Request Body:**
```json
{
  "lid_naam": "New User",
  "group_id": null
}
```

**Note:** `group_id` is optional. If not provided, user will have no assigned group.

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "lid_naam": "New User",
    "group_id": null
  }
}
```

**Error Response (409):**
```json
{
  "error": "User already exists"
}
```

---

#### `PUT /api/users/:lid_naam/group`
Assign a user to a group (or change their group).

**Parameters:**
- `lid_naam` - User identifier

**Request Body:**
```json
{
  "group_id": 1
}
```

**Response:**
```json
{
  "message": "User assigned to group successfully",
  "user": {
    "lid_naam": "DiSC van der Lid",
    "group_id": 1
  }
}
```

**Error Responses (404):**
```json
{
  "error": "User not found"
}
```
or
```json
{
  "error": "Group not found"
}
```

---

### Group Management (New Database)

#### `GET /api/groups`
Get all groups from the database.

**Response:**
```json
{
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Group A"
    },
    {
      "id": 2,
      "name": "Group B"
    }
  ]
}
```

---

#### `GET /api/groups/:id`
Get a specific group by ID.

**Parameters:**
- `id` - Group ID

**Response:**
```json
{
  "id": 1,
  "name": "Group A"
}
```

**Error Response (404):**
```json
{
  "error": "Group not found"
}
```

---

#### `POST /api/groups`
Create a new group.

**Request Body:**
```json
{
  "name": "New Group"
}
```

**Response (201):**
```json
{
  "message": "Group created successfully",
  "group": {
    "id": 3,
    "name": "New Group"
  }
}
```

**Error Response (409):**
```json
{
  "error": "Group already exists"
}
```

---

---

### Leaderboard (Read-Only Database with Product Multipliers)

#### `GET /api/leaderboard/users?since=YYYY-MM-DDTHH:MM:SS&limit=100`
Get a user leaderboard showing scores based on products ordered multiplied by their multiplier values, sorted descending.

**Query Parameters:**
- `since` (required) - ISO 8601 datetime format
- `limit` (optional, default: 100) - Maximum number of results

**Calculation:**
```
User Score = SUM(product_amount * product_multiplier) for all products ordered since the date
```

**Response:**
```json
{
  "type": "user",
  "since": "2026-03-30T15:30:00.000Z",
  "count": 2,
  "data": [
    {
      "rank": 1,
      "lid_naam": "DiSC van der Lid",
      "score": 23,
      "product_variety": 2,
      "total_items": 5
    },
    {
      "rank": 2,
      "lid_naam": "Another User",
      "score": 15,
      "product_variety": 1,
      "total_items": 3
    }
  ]
}
```

**Fields:**
- `rank` - Position in leaderboard (1-indexed)
- `lid_naam` - User identifier
- `score` - Total score (sum of product_amount × multiplier)
- `product_variety` - Number of distinct products ordered
- `total_items` - Total quantity of all items ordered

---

#### `GET /api/leaderboard/groups?since=YYYY-MM-DDTHH:MM:SS&limit=100`
Get a group leaderboard showing scores based on all members' products ordered multiplied by their multiplier values, sorted descending.

**Query Parameters:**
- `since` (required) - ISO 8601 datetime format
- `limit` (optional, default: 100) - Maximum number of results

**Calculation:**
```
Group Score = SUM(product_amount * product_multiplier) for all products ordered by group members since the date
```

**Response:**
```json
{
  "type": "group",
  "since": "2026-03-30T15:30:00.000Z",
  "count": 2,
  "data": [
    {
      "rank": 1,
      "group_id": 1,
      "group_name": "Group A",
      "score": 38,
      "product_variety": 3,
      "total_items": 8,
      "member_count": 2
    },
    {
      "rank": 2,
      "group_id": null,
      "group_name": "Unassigned",
      "score": 10,
      "product_variety": 2,
      "total_items": 2,
      "member_count": 1
    }
  ]
}
```

**Fields:**
- `rank` - Position in leaderboard (1-indexed)
- `group_id` - Group identifier (null for unassigned users)
- `group_name` - Group name (or "Unassigned" for users without a group)
- `score` - Total score (sum of all members' product_amount × multiplier)
- `product_variety` - Number of distinct products ordered by the group
- `total_items` - Total quantity of all items ordered by the group
- `member_count` - Number of members in the group who made orders

---

#### `GET /api/schema`
Get the database schema for the `product_sales_simplified` table from the barboek database.

**Response:**
```json
{
  "table": "product_sales_simplified",
  "columns": [
    {
      "name": "product_name",
      "type": "varchar(100)",
      "nullable": false,
      "key": null,
      "extra": null
    },
    {
      "name": "product_id",
      "type": "int",
      "nullable": false,
      "key": null,
      "extra": null
    },
    ...
  ]
}
```

---

## Core Classes

### ProductSalesSimplified
Represents a single product sale from the barboek database.

**Constructor:**
```javascript
new ProductSalesSimplified(
  product_name,
  product_id,
  product_amount,
  product_price_paid = null,
  lid_naam = null
)
```

**Factory Method:**
```javascript
ProductSalesSimplified.fromRow(databaseRow)
```

---

### Product
Represents a product in the new database with optional price multiplier.

**Constructor:**
```javascript
new Product(
  product_id,
  product_name,
  multiplier = 1
)
```

**Factory Method:**
```javascript
Product.fromRow(databaseRow)
```

---

### User
Represents a user in the system with optional group assignment.

**Constructor:**
```javascript
new User(
  lid_naam,
  group_id = null
)
```

**Factory Method:**
```javascript
User.fromRow(databaseRow)
```

---

### Group
Represents a group that users can be assigned to.

**Constructor:**
```javascript
new Group(
  id,
  name
)
```

**Factory Method:**
```javascript
Group.fromRow(databaseRow)
```

---

## Workflow

1. **Initialize Database:** Call `POST /api/init` to create all tables (products, groups, users)
2. **Create Groups:** Use `POST /api/groups` to create group(s) for organizing users
3. **Create Users:** Use `POST /api/users` to create users with optional group assignment
4. **Set Multipliers:** Use `PUT /api/products/:id/multiplier` to configure product multipliers (weights)
5. **Fetch Sales:** Call `GET /api/product-sales?since=YYYY-MM-DDTHH:MM:SS` to retrieve sales
   - New products encountered are automatically added to the products table with multiplier = 1
6. **View Leaderboards:**
   - `GET /api/leaderboard/users?since=...&limit=100` - Rank users by score
   - `GET /api/leaderboard/groups?since=...&limit=100` - Rank groups by score
7. **Manage Data:** Update products, users, and groups as needed
8. **Query Schema:** Use `/api/schema` to inspect the barboek database structure

---

## Running the Server

```bash
npm start
# or
node index.js
```

The server logs available endpoints on startup.

---

## Notes

- The barboek database is **read-only**; modifications are only made to the new database
- Product auto-discovery happens on each `/api/product-sales` call
- The multiplier field supports decimal values (0-127) for flexible pricing adjustments
- All timestamps use ISO 8601 format
- Users are uniquely identified by `lid_naam` (from barboek database)
- Users can be assigned to groups for organizational purposes
- Groups are deleted independently; users lose their group assignment when a group is deleted
- **Leaderboard Scoring:** The leaderboard multiplies each product's amount by its multiplier for a weighted score
  - Example: 2 Fanta (multiplier 4) + 3 Coke (multiplier 5) = (2 × 4) + (3 × 5) = 8 + 15 = 23 points
- Leaderboards include users/groups without multiplier-configured products (they use default multiplier of 1)
- "Unassigned" group in group leaderboard represents users not assigned to any group
