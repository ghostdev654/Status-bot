
// Ejemplo de cómo enviar datos de servidor al status page
// Este archivo es solo de ejemplo, no se ejecuta en el servidor

const SERVER_URL = 'https://tu-dominio.vercel.app'; // Cambiar por tu URL de Vercel
const SERVER_ID = 'status-bot'; // ID único del servidor/bot

async function sendServerStatus() {
  try {
    const serverData = {
      serverId: SERVER_ID,
      uptime: process.uptime(), // Tiempo de actividad en segundos
      status: 'online', // 'online' o 'offline'
      subBots: 3, // Cantidad de sub-bots activos
      ramUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // RAM en MB
      cpuUsage: Math.round(Math.random() * 100) // CPU en porcentaje (ejemplo)
    };

    const response = await fetch(`${SERVER_URL}/api/server-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(serverData)
    });

    if (response.ok) {
      console.log('Status updated successfully');
    } else {
      console.error('Failed to update status:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending status:', error);
  }
}

// Enviar estado cada 4 segundos (antes del timeout de 5s)
setInterval(sendServerStatus, 4000);

// Enviar estado inicial
sendServerStatus();

// Ejemplo de uso en un bot de Discord:
/*
const { Client } = require('discord.js');
const client = new Client({ intents: ['GuildMessages'] });

client.on('ready', () => {
  console.log(`Bot ${client.user.tag} está listo!`);
  
  // Función para contar sub-bots o servicios activos
  function getSubBotsCount() {
    // Aquí puedes implementar la lógica para contar sub-bots
    // Ejemplo: cantidad de servidores, comandos activos, etc.
    return client.guilds.cache.size; // Cantidad de servidores como ejemplo
  }
  
  // Enviar datos cada 4 segundos
  setInterval(() => {
    const serverData = {
      serverId: 'discord-bot',
      uptime: process.uptime(),
      status: 'online',
      subBots: getSubBotsCount(),
      ramUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // RAM en MB
      cpuUsage: Math.round(Math.random() * 100) // CPU en porcentaje
    };
    
    fetch('https://tu-dominio.vercel.app/api/server-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serverData)
    }).catch(console.error);
  }, 4000);
});

client.login('TU_TOKEN_DEL_BOT');
*/
