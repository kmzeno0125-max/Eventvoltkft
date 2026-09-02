import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/')) {
            try {
              const handler = (await import('./api/send-email.js')).default;

              const chunks = [];
              for await (const chunk of req) {
                chunks.push(chunk);
              }
              const bodyStr = Buffer.concat(chunks).toString('utf-8');
              req.body = bodyStr ? JSON.parse(bodyStr) : {};

              // Polyfill Express-style res.status() and res.json() on native Node response
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (obj) => {
                if (!res.headersSent) {
                  res.setHeader('Content-Type', 'application/json');
                }
                res.end(JSON.stringify(obj));
                return res;
              };

              await handler(req, res);
            } catch (err) {
              console.error('API middleware hiba:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Szerver hiba' }));
              }
            }
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
});
