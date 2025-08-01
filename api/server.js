const express = require('express');
const serverRoutes = require('./api/routes/serverRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/api', serverRoutes);

// Ruta principal para verificar el funcionamiento del servidor
app.get('/', (req, res) => {
  res.send('¡API funcionando correctamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
