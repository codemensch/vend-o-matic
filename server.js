const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello from Vend-O-Matic!' }));
});

server.listen(PORT, () => {
  console.log(`Vending machine server running on http://localhost:${PORT}`);
});