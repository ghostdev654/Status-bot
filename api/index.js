const http = require('http');
const { parse } = require('url');
const { updateServer, getBotStatus } = require('./data');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const urlParsed = parse(req.url, true);

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.end();

  if (urlParsed.pathname === '/api/status' && req.method === 'GET') {
    const botId = urlParsed.query.bot || 'status-bot';
    const status = getBotStatus(botId);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(status, null, 2));
  }

  if (urlParsed.pathname === '/api/server-update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const ok = updateServer(data);
        res.writeHead(ok ? 200 : 400, { "Content-Type": "application/json" });
        res.end(JSON.stringify(ok ? { success: true } : { error: "Invalid or missing serverId" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => console.log(`🌐 API corriendo en puerto ${PORT}`));
