
// API endpoint para obtener el estado del bot
function handleStatus(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const botId = url.searchParams.get('bot') || 'status-bot';
  
  const botData = {
    'status-bot': {
      name: "Status Bot",
      status: "online",
      uptime: process.uptime(),
      version: "1.0.0",
      lastUpdate: new Date().toISOString()
    },
    'moderation-bot': {
      name: "Moderation Bot",
      status: "online",
      uptime: process.uptime() * 0.8,
      version: "2.1.0",
      lastUpdate: new Date().toISOString()
    },
    'music-bot': {
      name: "Music Bot",
      status: "offline",
      uptime: 0,
      version: "1.5.2",
      lastUpdate: new Date().toISOString()
    },
    'welcome-bot': {
      name: "Welcome Bot",
      status: "online",
      uptime: process.uptime() * 1.2,
      version: "1.3.0",
      lastUpdate: new Date().toISOString()
    }
  };

  const statusData = {
    bot: botData[botId] || botData['status-bot'],
    server: {
      status: "operational",
      responseTime: "< 100ms",
      location: "Replit Cloud"
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

  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(statusData, null, 2));
}

module.exports = handleStatus;
