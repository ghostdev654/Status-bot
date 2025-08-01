function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function actualizarEstado() {
  fetch("/api/status?bot=status-bot")
    .then(res => res.json())
    .then(data => {
      const bot = data.bot;
      document.getElementById("nombre").textContent = bot.name;
      document.getElementById("estado").textContent = bot.status;
      document.getElementById("uptime").textContent = formatUptime(bot.uptime);
      document.getElementById("subbots").textContent = bot.subBots;
      document.getElementById("ram").textContent = bot.ramUsed;
      document.getElementById("cpu").textContent = bot.cpuUsage;
    })
    .catch(err => {
      console.error("Error al obtener datos:", err);
      document.getElementById("estado").textContent = "offline";
    });
}

setInterval(actualizarEstado, 4000);
actualizarEstado();
