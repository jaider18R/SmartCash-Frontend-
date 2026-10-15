// Configuración central. Las llamadas del navegador van SIEMPRE a rutas
// relativas (/api/...) y el proxy de Vite (vite.config.js) las reenvía.
export const API = {
  AUTH: '/api/auth',
  TRANSACCIONES: '/api/transacciones',
  CATEGORIAS: '/api/categorias',
  PRESUPUESTOS: '/api/presupuestos',
  METAS: '/api/metas-ahorro',
  ANALITICA: '/api/analitica',
}

