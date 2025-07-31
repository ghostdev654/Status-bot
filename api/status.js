import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('./data/status.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { uptime, cpu, memory, disk } = req.body;

    const payload = {
      uptime: uptime || "0m",
      cpu: cpu || 0,
      memory: memory || 0,
      disk: disk || 0
    };

    fs.writeFileSync(dataPath, JSON.stringify(payload, null, 2));
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    if (!fs.existsSync(dataPath)) {
      return res.status(200).json({
        uptime: "--", cpu: "--", memory: "--", disk: "--"
      });
    }
    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  }

  res.status(405).json({ error: "Método no permitido" });
}
