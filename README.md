# Vend-O-Matic

A vending machine service built with native Node.js (no external dependencies).

## Overview

This service simulates a beverage vending machine that accepts US quarters and dispenses drinks. Built as a RESTful HTTP API.

## Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd vend-o-matic

# No dependencies to install!

# Run the server
node server.js
```

Server runs on `http://localhost:3000`

## API Endpoints

### Insert Coin
```bash
PUT /
Content-Type: application/json
Body: {"coin": 1}

Response: 204 No Content
Headers: X-Coins: <number of coins inserted>
```

### Return Coins
```bash
DELETE /

Response: 204 No Content
Headers: X-Coins: <number of coins returned>
```

### Get All Inventory
```bash
GET /inventory

Response: 200 OK
Body: [5, 5, 5]  # Array of quantities for items 1, 2, 3
```

### Get Item Inventory
```bash
GET /inventory/:id

Response: 200 OK
Body: 5  # Quantity remaining
```

### Purchase Item
```bash
PUT /inventory/:id

Response: 200 OK (success)
Headers: 
  X-Coins: <coins returned as change>
  X-Inventory-Remaining: <items left>
Body: {"quantity": 1}

Response: 403 Forbidden (insufficient funds)
Response: 404 Not Found (out of stock or invalid item)
```

## Rules

- Machine accepts US quarters only (represented as `{"coin": 1}`)
- Purchase price: 2 quarters
- Initial inventory: 5 of each of 3 beverages
- Valid item IDs: 1, 2, 3
- Excess coins returned as change
- Only 1 item dispensed per transaction

## Example Usage
```bash
# Insert 2 coins
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 1}'
curl -X PUT http://localhost:3000 -H "Content-Type: application/json" -d '{"coin": 1}'

# Purchase item 1
curl -X PUT http://localhost:3000/inventory/1

# Check remaining inventory
curl http://localhost:3000/inventory
```