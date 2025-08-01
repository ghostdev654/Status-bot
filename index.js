
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Función para servir archivos estáticos
function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Crear el servidor
const server = http.createServer((req, res) => {
  const url = req.url;

  // Ruta principal - servir index.html
  if (url === '/' || url === '/index.html') {
    serveStaticFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
  }
  // Servir archivos CSS
  else if (url.startsWith('/styles/')) {
    const cssFile = path.join(__dirname, url);
    serveStaticFile(res, cssFile, 'text/css');
  }
  // API endpoint para el estado
  else if (url.startsWith('/api/status')) {
    try {
      const statusHandler = require('./api/status.js');
      statusHandler(req, res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  }
  // API endpoint para recibir actualizaciones del servidor
  else if (url === '/api/server-update' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('📊 Received server data:', data);
        
        res.writeHead(200, { 
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*'
        });
        res.end('OK');
      } catch (error) {
        console.error('❌ Error parsing server data:', error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
  }
  // 404 para rutas no encontradas
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Status bot server running on port ${PORT}`);
  console.log(`📊 Access your status page at: http://localhost:${PORT}`);
});
