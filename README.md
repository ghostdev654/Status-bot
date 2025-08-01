# Status-bot
Página HTML de estado del bot compatible con Vercel

## Características
- ✅ Panel de estado en tiempo real
- ✅ Soporte para múltiples bots
- ✅ API para recibir datos de servidores
- ✅ Detección automática de servidores offline (5s timeout)
- ✅ Visualización de sub-bots
- ✅ Compatible con Vercel

## Despliegue en Vercel

1. Sube el proyecto a GitHub
2. Ve a [Vercel](https://vercel.com) y conecta tu repositorio
3. Vercel detectará automáticamente la configuración
4. Despliega el proyecto

## API Endpoints

### GET /api/status?bot=BOT_ID
Obtiene el estado de un bot específico.

### POST /api/server-update
Actualiza los datos de un servidor. Debe enviar:
```json
{
  "serverId": "nombre-del-bot",
  "uptime": 12345,
  "status": "online",
  "subBots": 3,
  "ramUsed": 256,
  "cpuUsage": 45
}
```

## Uso en tu bot

Para que tu bot envíe datos al status page, usa el ejemplo en `example-client.js`:

```javascript
// Envía datos cada 4 segundos
setInterval(() => {
  const serverData = {
    serverId: 'mi-bot',
    uptime: process.uptime(),
    status: 'online',
    subBots: 5,
    ramUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // RAM en MB
    cpuUsage: 45 // CPU en porcentaje
  };
  
  fetch('https://tu-dominio.vercel.app/api/server-update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(serverData)
  });
}, 4000);
```

## Funcionalidades
- Si un servidor no envía datos por 5 segundos, se marca como offline
- Muestra uptime formateado (días, horas, minutos, segundos)
- Contador de sub-bots en tiempo real
- Interfaz responsive y moderna 
