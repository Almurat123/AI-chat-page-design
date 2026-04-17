import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

// In-memory mock databases for the Demo
const mockDb = {
  users: {
    '1': { id: '1', name: 'Demo User', avatar: '' }
  },
  history: [] as any[]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === Backend APIs ===
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Mock User System
  app.get('/api/user', (req, res) => {
    // Return standard demo user
    res.json(mockDb.users['1']);
  });

  // Mock History System
  app.get('/api/history', (req, res) => {
    res.json(mockDb.history);
  });

  app.post('/api/history', (req, res) => {
    const chatSession = req.body;
    mockDb.history.push({ ...chatSession, id: Date.now().toString() });
    res.json({ status: 'success' });
  });

  app.delete('/api/history/:id', (req, res) => {
    mockDb.history = mockDb.history.filter(h => h.id !== req.params.id);
    res.json({ status: 'success' });
  });

  // === Vite Middleware ===
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
