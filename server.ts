import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, {
    creations: [],
    settings: {
      contact: {
        title: '联系造物者',
        description: '扫描二维码关注造物测官方小红书，获取更多关于设计美学与造物灵感的深度资讯。',
        email: 'hello@zaowuce.design',
        xiaohongshu: 'zaowu_official',
        updatedAt: new Date().toISOString()
      }
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---
  
  // Auth
  app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true, token: 'admin-session-token' });
    } else {
      res.status(401).json({ success: false, message: '密码错误' });
    }
  });

  // Creations
  app.get('/api/creations', async (req, res) => {
    try {
      const data = await fs.readJson(DATA_FILE);
      res.json(data.creations);
    } catch (e) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  });

  app.post('/api/creations', async (req, res) => {
    const { token } = req.headers;
    if (token !== 'admin-session-token') return res.status(403).send('Forbidden');
    
    try {
      const data = await fs.readJson(DATA_FILE);
      const newCreation = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
      data.creations.unshift(newCreation);
      await fs.writeJson(DATA_FILE, data);
      res.json(newCreation);
    } catch (e) {
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

  app.put('/api/creations/:id', async (req, res) => {
    const { token } = req.headers;
    if (token !== 'admin-session-token') return res.status(403).send('Forbidden');

    try {
      const data = await fs.readJson(DATA_FILE);
      const index = data.creations.findIndex((c: any) => c.id === req.params.id);
      if (index !== -1) {
        data.creations[index] = { ...data.creations[index], ...req.body, updatedAt: new Date().toISOString() };
        await fs.writeJson(DATA_FILE, data);
        res.json(data.creations[index]);
      } else {
        res.status(404).send('Not found');
      }
    } catch (e) {
      res.status(500).json({ error: 'Failed to update data' });
    }
  });

  app.delete('/api/creations/:id', async (req, res) => {
    const { token } = req.headers;
    if (token !== 'admin-session-token') return res.status(403).send('Forbidden');

    try {
      const data = await fs.readJson(DATA_FILE);
      data.creations = data.creations.filter((c: any) => c.id !== req.params.id);
      await fs.writeJson(DATA_FILE, data);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete data' });
    }
  });

  // Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const data = await fs.readJson(DATA_FILE);
      res.json(data.settings.contact);
    } catch (e) {
      res.status(500).json({ error: 'Failed to read settings' });
    }
  });

  app.post('/api/settings', async (req, res) => {
    const { token } = req.headers;
    if (token !== 'admin-session-token') return res.status(403).send('Forbidden');

    try {
      const data = await fs.readJson(DATA_FILE);
      data.settings.contact = { ...req.body, updatedAt: new Date().toISOString() };
      await fs.writeJson(DATA_FILE, data);
      res.json(data.settings.contact);
    } catch (e) {
      res.status(500).json({ error: 'Failed to save settings' });
    }
  });

  // Catch-all for other /api requests
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // --- Vite / Static Files ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
