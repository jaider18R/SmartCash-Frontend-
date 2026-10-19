import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Puertos verificados en el backend (application.properties):
//   usuarios-auth 8081 | transacciones-service 8082 (transacciones, categorías,
//   presupuestos, metas) | categorizacion-service (IA) 8000.
// Los Controllers de transacciones usan "/transacciones" (sin /api), por eso ese
// prefijo lleva rewrite; categorias/presupuestos/metas-ahorro SÍ llevan /api en el backend.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const auth = env.VITE_PROXY_AUTH || 'http://localhost:8081'
  const tx = env.VITE_PROXY_TRANSACCIONES || 'http://localhost:8082'
  const quitarApi = (path) => path.replace(/^\/api/, '')

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api/auth': { target: auth, changeOrigin: true, rewrite: quitarApi },
        '/api/transacciones': { target: tx, changeOrigin: true, rewrite: quitarApi },
        '/api/categorias': { target: tx, changeOrigin: true },
        '/api/presupuestos': { target: tx, changeOrigin: true },
        '/api/metas-ahorro': { target: tx, changeOrigin: true },
        '/api/analitica': { target: env.VITE_PROXY_ANALITICA || 'http://localhost:8084', changeOrigin: true },
        '/api/ocr': { target: env.VITE_PROXY_CATEGORIZACION || 'http://localhost:8000', changeOrigin: true, rewrite: quitarApi },
      },
    },
    test: { environment: 'node', include: ['src/**/*.test.js'] },
  }
})
