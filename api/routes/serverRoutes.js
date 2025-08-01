const express = require('express');
const { updateServerData, getServerStatus } = require('../controllers/serverController.js');

const router = express.Router();

// Endpoint para recibir datos del servidor externo
router.post('/update', updateServerData);

// Endpoint para obtener el estado del servidor
router.get('/status', getServerStatus);

module.exports = router;
