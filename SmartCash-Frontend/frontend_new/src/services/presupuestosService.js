import { API } from '../config/env'
import { apiFetch } from './http'

// GET /api/presupuestos -> [{ idPresupuesto, idCategoria, nombreCategoria, montoLimite, mes, anio }]
export const listarPresupuestos = () => apiFetch(API.PRESUPUESTOS)

// POST /api/presupuestos (crea o actualiza): { idCategoria, nombreCategoria, montoLimite, mes, anio }
export const guardarPresupuesto = (datos) => apiFetch(API.PRESUPUESTOS, { method: 'POST', body: datos })
