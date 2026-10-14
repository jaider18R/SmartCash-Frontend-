import { describe, it, expect } from 'vitest'
import { nivelPresupuesto, gastoPorCategoria, formatCOP, getUserIdFromToken } from './helpers'

describe('nivelPresupuesto', () => {
  it('verde < 80', () => expect(nivelPresupuesto(79.9)).toBe('verde'))
  it('naranja desde 80 hasta <100', () => {
    expect(nivelPresupuesto(80)).toBe('naranja')
    expect(nivelPresupuesto(99.99)).toBe('naranja')
  })
  it('rojo desde 100', () => expect(nivelPresupuesto(100)).toBe('rojo'))
})
describe('gastoPorCategoria', () => {
  it('suma solo gastos del mes', () => {
    const t = [
      { tipoMovimiento: 'gasto', idCategoria: 'a', fecha: '2026-10-02', monto: 100 },
      { tipoMovimiento: 'gasto', idCategoria: 'a', fecha: '2026-10-20', monto: 50 },
      { tipoMovimiento: 'ingreso', idCategoria: 'a', fecha: '2026-10-05', monto: 999 },
      { tipoMovimiento: 'gasto', idCategoria: 'a', fecha: '2026-09-30', monto: 7 },
    ]
    expect(gastoPorCategoria(t, 10, 2026)).toEqual({ a: 150 })
  })
})
describe('formatCOP', () => {
  it('formatea pesos', () => expect(formatCOP(1250000)).toContain('1.250.000'))
})
describe('getUserIdFromToken', () => {
  it('lee id_usuario', () => {
    const p = btoa(JSON.stringify({ id_usuario: 'u1' }))
    expect(getUserIdFromToken(`x.${p}.y`)).toBe('u1')
  })
  it('token inválido -> null', () => expect(getUserIdFromToken('basura')).toBeNull())
})
