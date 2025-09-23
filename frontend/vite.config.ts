import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'url';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      minify: env.VITE_MINIFY === 'true' ? 'esbuild' : mode === 'production' ? 'esbuild' : false,
      target: env.VITE_BUILD_TARGET || (mode === 'production' ? 'es2015' : 'es2020'),
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            query: ['@tanstack/react-query'],
            i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
            ui: ['@headlessui/react', '@heroicons/react'],
            utils: ['axios', 'zustand'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      assetsInlineLimit: 4096,
    },
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __DEV_MODE__: JSON.stringify(env.VITE_DEV_MODE === 'true'),
      __LOG_LEVEL__: JSON.stringify(env.VITE_LOG_LEVEL || 'info'),
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      legalComments: mode === 'production' ? 'none' : 'inline',
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'react-i18next',
        'i18next',
        'axios',
        'zustand',
      ],
    },
  }
})
