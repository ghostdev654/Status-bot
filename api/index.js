const url = require('url');

const serverData = new Map();
const SERVER_TIMEOUT = 5000;

function cleanupOfflineServers() {
  const now = Date.now();
  for (const [serverId, data] of serverData.entries()) {
    if (now - data.lastSeen > SERVER_TIMEOUT) {
      serverData.set(serverId, {
        ...data,
        status: 'offline',
        uptime: 0
      });
    }
  }
}

setInterval(cleanupOfflineServers, 2000);

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.end();

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/status' && req.method === 'GET') {
    const botId = parsedUrl.query.bot || 'status-bot';
    cleanupOfflineServers();
    const serverInfo = serverData.get(botId) || {
      name: botId,
      status: 'offline',
      uptime: 0,
      subBots: 0,
      ramUsed: 0,
      cpuUsage: 0,
      lastUpdate: new Date().toISOString()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      bot: serverInfo,
      server: {
        status: serverInfo.status === 'online' ? 'operational' : 'offline',
        location: "Render Cloud",
        responseTime: "<100ms"
      }
    }));
  }

  else if (pathname === '/api/server-update' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        serverData.set(data.serverId, {
          name: data.serverId,
          status: data.status || 'online',
          uptime: data.uptime || 0,
          subBots: data.subBots || 0,
          ramUsed: data.ramUsed || 0,
          cpuUsage: data.cpuUsage || 0,
          lastSeen: Date.now(),
          lastUpdate: new Date().toISOString()
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
};
