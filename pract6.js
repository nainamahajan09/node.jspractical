import http from 'node:http';

const port = 3000;

const requestListener = async (req, res) => {
  if (req.url === '/info') {
    const os = await import('node:os');
    res.writeHead(200);
    res.end(`Uptime: ${os.default.uptime()}s`);
  } else {
    res.writeHead(200);
    res.end('Hello, dynamic imports!');
  }
};

const server = http.createServer(requestListener);
await new Promise(resolve => server.listen(port, resolve));
console.log(`Server running at http://localhost:${port}/`);
