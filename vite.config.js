import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // В разработке /api и /_/ проксируются на PocketBase (по умолчанию локальный: npm run pb)
  const target = env.PB_PROXY_TARGET || 'http://127.0.0.1:8090';

  return {
    plugins: [react()],
    css: {
      modules: {
        // читаемые имена классов в dev: Header_root__a1b2c
        generateScopedName: '[name]_[local]__[hash:base64:5]',
      },
    },
    server: {
      // Явно IPv4: иначе Node слушает только ::1 (IPv6), а на этой машине подключение к ::1 не проходит
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api': { target, changeOrigin: true },
        '/_/': { target, changeOrigin: true },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  };
});
