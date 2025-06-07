const http = require('http');

// Create a basic HTTP server
const server = http.createServer(async (req, res) => {
  if (req.url === '/test-health' && req.method === 'GET') {
    try {
      // Use fetch to send a request to the tRPC health check endpoint
      const fetch = global.fetch || (await import('node-fetch')).default;
      const response = await fetch('http://localhost:3000/api/trpc/router.healthCheck');
      const data = await response.text();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: response.status, body: data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}/test-health`)
});
