import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

const envDir = path.resolve(import.meta.dirname, '../..');

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, envDir, ''), ...process.env };

  const rawPort = env.WEB_PORT ?? env.PORT ?? "3000";
  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid port value: "${rawPort}"`);
  }

  const basePath = env.BASE_PATH ?? "/";

  const apiPort = env.API_PORT ?? env.PORT ?? '8080';

  return {
    base: basePath,
    envDir,
    plugins: [
      react(),
      tailwindcss({ optimize: env.NODE_ENV === 'production' }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@clerk')) return 'clerk';
              if (id.includes('@tanstack/react-query')) return 'query';
              if (id.includes('lucide-react')) return 'icons';
              if (id.includes('react-dom') || id.includes('/react/')) return 'vendor';
            }
            if (id.includes('/src/pages/Admin')) return 'page-admin';
            if (id.includes('/src/pages/Contact')) return 'page-contact';
            if (id.includes('/src/pages/Gallery')) return 'page-gallery';
            if (id.includes('/src/pages/Products')) return 'page-products';
          },
        },
      },
    },
    server: {
      port,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      fs: {
        strict: true,
      },
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              const host = req.headers.host;
              if (host) {
                proxyReq.setHeader('x-forwarded-host', host);
              }
            });
          },
        },
        '/uploads': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
