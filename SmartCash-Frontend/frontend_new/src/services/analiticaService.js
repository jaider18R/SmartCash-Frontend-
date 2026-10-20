import { API } from '../config/env'
import { apiFetch } from './http'

// Resumen del mes: ingresos, gastos, balance, tasa de ahorro y gasto por categoría.
export function resumenMensual(mes, anio) {
  const q = new URLSearchParams()
  if (mes) q.set('mes', mes)
  if (anio) q.set('anio', anio)
  const sufijo = q.toString() ? `?${q}` : ''
  return apiFetch(`${API.ANALITICA}/resumen-mensual${sufijo}`)
}

// Gasto seguro diario ("safe-to-spend").
export function gastoSeguro({ compromisosFijos = 0, ahorroMetas = 0 } = {}) {
  return apiFetch(`${API.ANALITICA}/safe-to-spend`, {
    method: 'POST',
    body: { compromisos_fijos: Number(compromisosFijos) || 0, ahorro_metas: Number(ahorroMetas) || 0 },
  })
}

// Simulador "what-if": qué pasa con mi límite diario si hago esta compra.
export function simularGasto({ montoSimulado, compromisosFijos = 0, ahorroMetas = 0 }) {
  return apiFetch(`${API.ANALITICA}/simular-gasto`, {
    method: 'POST',
    body: {
      monto_simulado: Number(montoSimulado),
      compromisos_fijos: Number(compromisosFijos) || 0,
      ahorro_metas: Number(ahorroMetas) || 0,
    },
  })
}
