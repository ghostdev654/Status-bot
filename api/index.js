
const url = require('url');

// Almacenamiento temporal de datos de servidores
const serverData = new Map();
const SERVER_TIMEOUT = 5000; // 5 segundos

// Función para limpiar servidores offline
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

// Ejecutar limpieza cada 2 segundos
setInterval(cleanupOfflineServers, 2000);

module.exports = (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/status' && req.method === 'GET') {
    handleGetStatus(req, res, parsedUrl);
  } else if (pathname === '/api/server-update' && req.method === 'POST') {
    handleServerUpdate(req, res);
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not found' }));
  }
};

function handleGetStatus(req, res, parsedUrl) {
  const botId = parsedUrl.query.bot || 'status-bot';
  
  // Limpiar servidores offline antes de responder
  cleanupOfflineServers();
  
  const serverInfo = serverData.get(botId) || {
    name: getBotName(botId),
    status: 'offline',
    uptime: 0,
    subBots: 0,
    ramUsed: 0,
    cpuUsage: 0,
    lastUpdate: new Date().toISOString(),
    lastSeen: 0
  };

  const statusData = {
    bot: {
      name: serverInfo.name,
      status: serverInfo.status,
      uptime: serverInfo.uptime,
      subBots: serverInfo.subBots,
      ramUsed: serverInfo.ramUsed,
      cpuUsage: serverInfo.cpuUsage,
      version: "1.0.0",
      lastUpdate: serverInfo.lastUpdate
    },
    server: {
      status: serverInfo.status === 'online' ? "operational" : "down",
      responseTime: serverInfo.status === 'online' ? "< 100ms" : "timeout",
      location: "Vercel Cloud"
    },
    services: [
      {
        name: "Web Interface",
        status: "operational",
        description: "Status page web interface"
      },
      {
        name: "API",
        status: "operational", 
        description: "Status API endpoint"
      }
    ]
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(statusData, null, 2));
}

function handleServerUpdate(req, res) {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const { serverId, uptime, status, subBots, ramUsed, cpuUsage } = data;
      
      if (!serverId) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'serverId is required' }));
        return;
      }
      
      // Actualizar datos del servidor
      serverData.set(serverId, {
        name: getBotName(serverId),
        status: status || 'online',
        uptime: uptime || 0,
        subBots: subBots || 0,
        ramUsed: ramUsed || 0,
        cpuUsage: cpuUsage || 0,
        lastUpdate: new Date().toISOString(),
        lastSeen: Date.now()
      });
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Server data updated' }));
      
    } catch (error) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  });
}

function getBotName(botId) {
  const names = {
    'status-bot': 'メ Ġᶏmԑя Bot',
    'moderation-bot': 'Moderation Bot',
    'music-bot': 'Music Bot',
    'welcome-bot': 'Welcome Bot'
  };
  return names[botId] || botId;
}
