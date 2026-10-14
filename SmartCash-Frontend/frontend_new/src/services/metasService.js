import { API } from '../config/env'
import { apiFetch } from './http'

// GET /api/metas-ahorro -> [{ idMeta, nombre, descripcion, montoObjetivo, montoActual, porcentajeProgreso, fechaLimite, estado }]
export const listarMetas = () => apiFetch(API.METAS)
export const crearMeta = (datos) => apiFetch(API.METAS, { method: 'POST', body: datos })
export const abonarMeta = (id, monto) => apiFetch(`${API.METAS}/${id}/abonar`, { method: 'POST', body: { monto } })
export const retirarMeta = (id, monto) => apiFetch(`${API.METAS}/${id}/retirar`, { method: 'POST', body: { monto } })
export const eliminarMeta = (id) => apiFetch(`${API.METAS}/${id}`, { method: 'DELETE' })
