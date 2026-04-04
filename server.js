import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), 'data.json');
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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Root Health Check
app.get('/server-health', (req, res) => {
  res.send(`<h1>Server is Running</h1><p>Time: ${new Date().toISOString()}</p>`);
});

// Global Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Router
const apiRouter = express.Router();

// Diagnostic Ping
apiRouter.get('/ping', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth
apiRouter.post(['/login', '/login/'], (req, res) => {
  const { password } = req.body || {};
  if (!password) {
    return res.status(400).json({ message: '请提供密码' });
  }
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-session-token' });
  } else {
    res.status(401).json({ success: false, message: '密码错误' });
  }
});

// Creations
apiRouter.get(['/creations', '/creations/'], async (req, res) => {
  try {
    const data = await fs.readJson(DATA_FILE);
    res.json(data.creations || []);
  } catch (e) {
    res.status(500).json({ message: 'Failed to read data' });
  }
});

apiRouter.post(['/creations', '/creations/'], async (req, res) => {
  const { token } = req.headers;
  if (token !== 'admin-session-token') return res.status(403).json({ message: 'Forbidden' });

  try {
    const data = await fs.readJson(DATA_FILE);
    const newCreation = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
    data.creations = data.creations || [];
    data.creations.unshift(newCreation);
    await fs.writeJson(DATA_FILE, data);
    res.json(newCreation);
  } catch (e) {
    res.status(500).json({ message: 'Failed to save data' });
  }
});

apiRouter.put(['/creations/:id', '/creations/:id/'], async (req, res) => {
  const { token } = req.headers;
  if (token !== 'admin-session-token') return res.status(403).json({ message: 'Forbidden' });

  try {
    const data = await fs.readJson(DATA_FILE);
    data.creations = data.creations || [];
    const index = data.creations.findIndex((c: any) => c.id === req.params.id);
    if (index !== -1) {
      data.creations[index] = { ...data.creations[index], ...req.body, updatedAt: new Date().toISOString() };
      await fs.writeJson(DATA_FILE, data);
      res.json(data.creations[index]);
    } else {
      res.status(404).json({ message: 'Creation not found' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Failed to update data' });
  }
});

apiRouter.delete(['/creations/:id', '/creations/:id/'], async (req, res) => {
  const { token } = req.headers;
  if (token !== 'admin-session-token') return res.status(403).json({ message: 'Forbidden' });

  try {
    const data = await fs.readJson(DATA_FILE);
    data.creations = data.creations || [];
    data.creations = data.creations.filter((c: any) => c.id !== req.params.id);
    await fs.writeJson(DATA_FILE, data);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete data' });
  }
});

// Settings
apiRouter.get(['/settings', '/settings/'], async (req, res) => {
  try {
    const data = await fs.readJson(DATA_FILE);
    res.json(data.settings?.contact || {});
  } catch (e) {
    res.status(500).json({ message: 'Failed to read settings' });
  }
});

apiRouter.post(['/settings', '/settings/'], async (req, res) => {
  const { token } = req.headers;
  if (token !== 'admin-session-token') return res.status(403).json({ message: 'Forbidden' });

  try {
    const data = await fs.readJson(DATA_FILE);
    data.settings = data.settings || {};
    data.settings.contact = { ...req.body, updatedAt: new Date().toISOString() };
    await fs.writeJson(DATA_FILE, data);
    res.json(data.settings.contact);
  } catch (e) {
    res.status(500).json({ message: 'Failed to save settings' });
  }
});

// Mount API router
app.use('/api', apiRouter);

// Catch-all for other /api requests
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.url}` });
});

// Serve static files from dist
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.status(500).send('Static files not found. Please run npm run build first.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});