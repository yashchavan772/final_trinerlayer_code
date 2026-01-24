import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

const securityPlugin = () => ({
  name: 'security-headers-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url || '';
      const blockedPatterns = [
        /^\/\.env/i,
        /^\/\.git/i,
        /^\/\.npmrc/i,
        /^\/\.yarnrc/i,
      ];
      
      const isBlocked = blockedPatterns.some(pattern => pattern.test(url));
      
      if (isBlocked) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Forbidden', message: 'Access denied' }));
        return;
      }
      
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  plugins: [securityPlugin(), tsconfigPaths(), react(), tagger()],
  server: {
    port: 5000,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
});