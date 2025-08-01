const serverData = require('../models/serverData');

// Actualizar datos del servidor
const updateServerData = (req, res) => {
  const { cpu, ram, subBots } = req.body;

  // Actualizar datos
  serverData.cpu = cpu || serverData.cpu;
  serverData.ram = ram || serverData.ram;
  serverData.subBots = subBots || serverData.subBots;
  serverData.status = 'Online';
  serverData.lastHeartbeat = Date.now();

  res.json({ message: 'Datos actualizados correctamente.', data: serverData });
};

// Obtener el estado del servidor
const getServerStatus = (req, res) => {
  // Verificar si el servidor está en línea
  if (serverData.lastHeartbeat && Date.now() - serverData.lastHeartbeat > 5000) {
    serverData.status = 'Offline';
    serverData.cpu = 0;
    serverData.ram = 0;
    serverData.subBots = 0;
  }

  res.json(serverData);
};

module.exports = { updateServerData, getServerStatus };
