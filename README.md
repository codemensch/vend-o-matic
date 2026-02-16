# Vend-O-Matic

A vending machine service built with native Node.js (no external dependencies).

## Overview

This service simulates a beverage vending machine that accepts US quarters and dispenses drinks. Built as a RESTful HTTP API using only Node.js built-in modules.

## Prerequisites

- Node.js (v14 or higher recommended)
- A terminal/command line interface
- `curl` for testing (or any HTTP client like Postman)

## Setup
```bash
# 1. Clone the repository
git clone https://github.com/codemensch/vend-o-matic.git
cd vend-o-matic

# 2. No dependencies to install! (Native Node.js only)

# 3. Start the server
node server.js
```

You should see:
```
Vending machine server running on http://localhost:3000
```

The server is now ready to accept requests. Keep this terminal window open.

## Testing the API

Open a **new terminal window** and use these `curl` commands to test:

### 1. Insert Coins

Insert a US quarter (must send `{"coin": 1}`):
```bash
curl -X PUT http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"coin": 1}'
```

**Response:** `204 No Content` with header `X-Coins: 1`

Insert another quarter:
```bash
curl -X PUT http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"coin": 1}'
```

**Response:** `204 No Content` with header `X-Coins: 2`

### 2. Check All Inventory
```bash
curl http://localhost:3000/inventory
```

**Response:** `[5,5,5]` (5 of each of 3 beverages)

### 3. Check Specific Item Inventory
```bash
curl http://localhost:3000/inventory/1
```

**Response:** `5` (quantity of item 1)

### 4. Purchase an Item

Purchase item 1 (requires 2 quarters):
```bash
curl -X PUT http://localhost:3000/inventory/1
```

**Response:** `{"quantity":1}` with headers:
- `X-Coins: 2` (coins returned as change)
- `X-Inventory-Remaining: 4`

### 5. Return Coins (Cancel Transaction)
```bash
curl -X DELETE http://localhost:3000
```

**Response:** `204 No Content` with header `X-Coins: <number>` (all inserted coins returned)

## Complete Workflow Example

Here's a full transaction from start to finish:
```bash
# 1. Check initial inventory
curl http://localhost:3000/inventory
# Returns: [5,5,5]

# 2. Insert 2 quarters (price of one item)
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 1}'
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 1}'

# 3. Purchase item 2
curl -X PUT http://localhost:3000/inventory/2
# Returns: {"quantity":1}

# 4. Verify inventory decreased
curl http://localhost:3000/inventory
# Returns: [5,4,5]
```

## API Reference

### Insert Coin
```
PUT /
Content-Type: application/json
Body: {"coin": 1}

Success Response:
  Status: 204 No Content
  Headers: X-Coins: <total coins inserted>

Error Response (invalid coin):
  Status: 400 Bad Request
  Headers: X-Coins: <current coins>
```

### Return Coins
```
DELETE /

Response:
  Status: 204 No Content
  Headers: X-Coins: <coins being returned>
```

### Get All Inventory
```
GET /inventory

Response:
  Status: 200 OK
  Body: [5, 5, 5]  # Array of quantities for items 1, 2, 3
```

### Get Item Inventory
```
GET /inventory/:id

Response:
  Status: 200 OK
  Body: 5  # Integer quantity

Error Response (invalid item ID):
  Status: 404 Not Found
```

### Purchase Item
```
PUT /inventory/:id

Success Response:
  Status: 200 OK
  Headers: 
    X-Coins: <coins returned as change>
    X-Inventory-Remaining: <items left in stock>
  Body: {"quantity": 1}

Error Responses:
  Insufficient Funds (< 2 quarters):
    Status: 403 Forbidden
    Headers: X-Coins: <current coins>
  
  Out of Stock:
    Status: 404 Not Found
    Headers: X-Coins: <current coins>
  
  Invalid Item ID:
    Status: 404 Not Found
```

## Business Rules

- **Coin Type:** Machine only accepts US quarters (represented as `{"coin": 1}`)
- **Purchase Price:** 2 quarters (50 cents)
- **Initial Inventory:** 5 of each of 3 beverages (items 1, 2, 3)
- **Valid Item IDs:** 1, 2, or 3
- **Change Return:** Excess coins returned as change after purchase
- **Single Item:** Only 1 item dispensed per transaction, regardless of coins inserted
- **Coin Validation:** Non-quarter coins (any value other than 1) are rejected with 400 error

## Error Scenarios

### Try to purchase with insufficient funds:
```bash
# Insert only 1 quarter
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 1}'

# Try to purchase (will fail)
curl -X PUT http://localhost:3000/inventory/1 -v
# Returns: 403 Forbidden, X-Coins: 1
```

### Try to purchase out-of-stock item:
```bash
# After buying all 5 of item 1...
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 1}'
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 1}'
curl -X PUT http://localhost:3000/inventory/1 -v
# Returns: 404 Not Found, X-Coins: 2
```

### Insert invalid coin:
```bash
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 5}' -v
# Returns: 400 Bad Request
```

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Technical Details

- Built with Node.js native `http` module (no frameworks)
- Manual routing and request parsing
- In-memory state management
- No external dependencies required