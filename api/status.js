const serverData = new Map();
const TIMEOUT = 5000;

function updateServer({ serverId, uptime = 0, status = 'online', subBots = 0, ramUsed = 0, cpuUsage = 0 }) {
  if (!serverId) return false;
  serverData.set(serverId, {
    name: getBotName(serverId),
    status,
    uptime,
    subBots,
    ramUsed,
    cpuUsage,
    lastUpdate: new Date().toISOString(),
    lastSeen: Date.now()
  });
  return true;
}

function getBotStatus(botId = 'status-bot') {
  cleanup();
  const data = serverData.get(botId) || {
    name: getBotName(botId),
    status: 'offline',
    uptime: 0,
    subBots: 0,
    ramUsed: 0,
    cpuUsage: 0,
    lastUpdate: new Date().toISOString()
  };

  return {
    bot: {
      name: data.name,
      status: data.status,
      uptime: data.uptime,
      subBots: data.subBots,
      ramUsed: data.ramUsed,
      cpuUsage: data.cpuUsage,
      version: "1.0.0",
      lastUpdate: data.lastUpdate
    },
    server: {
      status: data.status === 'online' ? 'operational' : 'down',
      responseTime: data.status === 'online' ? '< 100ms' : 'timeout',
      location: 'Render Cloud'
    },
    services: [
      { name: 'Web Interface', status: 'operational', description: 'Status page web interface' },
      { name: 'API', status: 'operational', description: 'Status API endpoint' }
    ]
  };
}

function cleanup() {
  const now = Date.now();
  for (const [id, data] of serverData.entries()) {
    if (now - data.lastSeen > TIMEOUT) {
      serverData.set(id, {
        ...data,
        status: 'offline',
        uptime: 0
      });
    }
  }
}

function getBotName(id) {
  return {
    'status-bot': 'メ Ġᶏmԑя Bot',
    'azura': 'Azura Ultra 2.0',
    'suki': 'Suki Bot'
  }[id] || id;
}

module.exports = { updateServer, getBotStatus };
