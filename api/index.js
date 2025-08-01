const express = require('express');
const { updateServer, getBotStatus } = require('./data');

const app = express();
app.use(express.json());

// Ruta para obtener el estado de un bot específico
app.get('/status', (req, res) => {
  const botId = req.query.bot || 'status-bot';
  const botStatus = getBotStatus(botId);
  res.json(botStatus);
});

// Ruta para actualizar datos del servidor
app.post('/server-update', (req, res) => {
  const success = updateServer(req.body);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid server data' });
  }
});

// Escuchar en el puerto especificado
const PORT = process.env.PORT || 3001; // Cambia el puerto si es necesario
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
