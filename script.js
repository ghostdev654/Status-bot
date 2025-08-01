const apiUrl = 'https://<tu-backend-en-render>.onrender.com/api/status'; // Cambia esto por tu URL de Render

async function fetchServerStatus() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Actualizar estado del Bot
    document.getElementById('bot-status-indicator').className = `status-indicator ${data.status.toLowerCase()}`;
    document.getElementById('bot-status-text').textContent = `Estado: ${data.status} | Uptime: ${data.uptime}s`;
    document.getElementById('bot-sub-bots').textContent = `Sub-Bots: ${data.subBots || 0}`;
    document.getElementById('bot-resources').textContent = `RAM: ${data.ram || 0}MB | CPU: ${data.cpu || 0}%`;

    // Actualizar servicios
    document.getElementById('web-interface-indicator').className = `status-indicator online`;
    document.getElementById('api-indicator').className = `status-indicator online`;

    // Actualizar información del servidor
    document.getElementById('server-status').textContent = data.status || 'offline';
    document.getElementById('response-time').textContent = '<100ms';
    document.getElementById('server-location').textContent = 'Render Cloud';
  } catch (error) {
    console.error('Error:', error);
  }
}

// Llamar al backend cada 5 segundos
setInterval(fetchServerStatus, 5000);
fetchServerStatus();
