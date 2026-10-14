import { API } from '../config/env'
import { apiFetch } from './http'

// POST /transacciones  { idUsuario, monto, fecha, comercio, tipoMovimiento }
// Respuesta: { idTransaccion, idCategoria, confianzaCategorizacion, ... }
export function registrarTransaccion(_token, datos) {
  return apiFetch(API.TRANSACCIONES, { method: 'POST', body: datos })
}

// GET /transacciones?tipo&categoriaId&desde&hasta&buscar (filtra el backend)
export function listarTransacciones(filtros = {}) {
  const params = new URLSearchParams()
  Object.entries(filtros).forEach(([k, v]) => { if (v) params.set(k, v) })
  const qs = params.toString()
  return apiFetch(qs ? `${API.TRANSACCIONES}?${qs}` : API.TRANSACCIONES)
}

// PUT /transacciones/{id}  { monto, fecha, comercio, tipoMovimiento, idCategoria? }
export function actualizarTransaccion(id, datos) {
  return apiFetch(`${API.TRANSACCIONES}/${id}`, { method: 'PUT', body: datos })
}

// DELETE /transacciones/{id} -> 204
export function eliminarTransaccion(id) {
  return apiFetch(`${API.TRANSACCIONES}/${id}`, { method: 'DELETE' })
}
