import { API } from '../config/env'
import { apiFetch } from './http'

export function obtenerCatalogoInversiones() {
  return apiFetch(`${API.ANALITICA}/inversiones/catalogo`)
}

export function simularInversiones(monto, plazoMeses = 12) {
  return apiFetch(`${API.ANALITICA}/inversiones/simular`, {
    method: 'POST',
    body: { monto: Number(monto), plazo_meses: Number(plazoMeses) }
  })
}
