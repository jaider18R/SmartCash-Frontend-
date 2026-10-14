import { API } from '../config/env'
import { apiFetch } from './http'

// GET /api/categorias -> [{ idCategoria, nombre, color, icono }]
export const listarCategorias = () => apiFetch(API.CATEGORIAS)
