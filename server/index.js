/**
 * Express + Vite Dev Server
 *
 * Dev mode: serves Vite dev server + API routes
 * This setup lets you test admin panel and contact forms while developing
 */

// Load environment variables FIRST, before importing anything else
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { handleRobots, handleSitemap, handleLlmsTxt } from './seo.js';
import { handleContactSubmission } from './api/contact.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// Trust proxy (for IP-based rate limiting)
app.set('trust proxy', 1);

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
  message: 'Too many contact submissions from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================================================
// API Routes
// ============================================================================

app.post('/api/contact', contactLimiter, handleContactSubmission);

// ============================================================================
// SEO Routes
// ============================================================================

app.get('/robots.txt', handleRobots);
app.get('/sitemap.xml', handleSitemap);
app.get('/llms.txt', handleLlmsTxt);

// ============================================================================
// Vite Dev Server (for dev mode)
// ============================================================================

const { createServer } = await import('vite');
const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

// ============================================================================
// Fallback to index.html for SPA routing
// ============================================================================

app.get('*', (req, res) => {
  const indexPath = path.resolve(root, 'index.html');
  res.sendFile(indexPath);
});

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log(`\n✅ Server running in development mode`);
  console.log(`\n   🌐 Public Site: http://localhost:${PORT}`);
  console.log(`   📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`\n✨ Vite dev server + API routes ready`);
  console.log(`📦 Supabase connected via .env.local\n`);
});
