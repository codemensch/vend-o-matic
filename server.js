const http = require('http');

const PORT = 3000;

// State management
let coinsInserted = 0;
const inventory = [5, 5, 5]; // 3 beverages, 5 of each

// Helper functions
function resetCoins() {
  const coins = coinsInserted;
  coinsInserted = 0;
  return coins;
}

function addCoin() {
  coinsInserted += 1;
  return coinsInserted;
}

function getInventory(id) {
  const index = parseInt(id) - 1; // Convert id (1,2,3) to index (0,1,2)
  return inventory[index];
}

function decrementInventory(id) {
  const index = parseInt(id) - 1;
  if (inventory[index] > 0) {
    inventory[index] -= 1;
    return true;
  }
  return false;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  const { method, url } = req;
  
  // Root endpoint - PUT / (insert coin) and DELETE / (return coins)
  if (url === '/') {
    if (method === 'PUT') {
      let body = '';

      // Read the request body in chunks
      req.on('data', chunk => {
        body += chunk.toString();
      });

      // When all data is received
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.coin === 1) {
            addCoin();
          }
          res.statusCode = 204;
          res.setHeader('X-Coins', coinsInserted.toString());
          res.end();
        } catch (error) {
          res.statusCode = 400; // Bad Request
          res.end();
        }
      });
    } else if (method === 'DELETE') {
      const coinsToReturn = resetCoins(); // Get coins and reset
      res.statusCode = 204;
      res.setHeader('X-Coins', coinsToReturn.toString());
      res.end();
    } else {
      res.statusCode = 405; // Method Not Allowed
      res.end();
    }
  }
  // Individual inventory item - GET /inventory/:id or PUT /inventory/:id
  else if (url.startsWith('/inventory/')) {
    const id = url.split('/')[2]; // Extract the ID from the URL
    
    if (method === 'GET') {
      const quantity = getInventory(id);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(quantity));
    } else if (method === 'PUT') {
      const itemQuantity = getInventory(id);
  
    // Check if item is out of stock
    if (itemQuantity === 0) {
      res.statusCode = 404;
      res.setHeader('X-Coins', coinsInserted.toString());
      res.end();
      return;
    }
  
    // Check if sufficient coins (need 2 quarters)
    if (coinsInserted < 2) {
      res.statusCode = 403;
      res.setHeader('X-Coins', coinsInserted.toString());
      res.end();
      return;
    }
  
    // Valid purchase - vend item and return change
    decrementInventory(id);
    const remaining = getInventory(id);
    const coinsToReturn = resetCoins();
  
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Coins', coinsToReturn.toString());
    res.setHeader('X-Inventory-Remaining', remaining.toString());
    res.end(JSON.stringify({ quantity: 1 }));
    } else {
      res.statusCode = 405; // Method Not Allowed
      res.end();
    }
  }
  // Inventory endpoints - GET /inventory
  else if (url === '/inventory' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(inventory)); // Use actual inventory state
  }
  // Not found
  else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Vending machine server running on http://localhost:${PORT}`);
});