const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  const { method, url } = req;
  
  // Root endpoint - PUT / (insert coin) and DELETE / (return coins)
  if (url === '/') {
    if (method === 'PUT') {
      res.statusCode = 204;
      res.setHeader('X-Coins', '0');
      res.end();
    } else if (method === 'DELETE') {
      res.statusCode = 204;
      res.setHeader('X-Coins', '0');
      res.end();
    } else {
      res.statusCode = 405; // Method Not Allowed
      res.end();
    }
  }
  // Inventory endpoints - GET /inventory
  else if (url === '/inventory' && method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([5, 5, 5])); // Placeholder: 5 of each item
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