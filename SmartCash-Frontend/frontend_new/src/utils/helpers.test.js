import { describe, it, expect } from 'vitest'
import { nivelPresupuesto, gastoPorCategoria, formatCOP, getUserIdFromToken, soloDigitos, formatMiles } from './helpers'

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

describe('campos de dinero', () => {
  it('pone el punto de los miles', () => {
    expect(formatMiles('10000')).toBe('10.000')
    expect(formatMiles('1250000')).toBe('1.250.000')
    expect(formatMiles('999')).toBe('999')
  })
  it('acepta lo que ya trae puntos y quita letras', () => {
    expect(soloDigitos('1.250abc')).toBe('1250')
    expect(formatMiles('1.250.000')).toBe('1.250.000')
  })
  it('redondea decimales que llegan del servidor', () => {
    expect(formatMiles('25000.00')).toBe('25.000')
    expect(formatMiles(25000.6)).toBe('25.001')
  })
  it('vacío y ceros a la izquierda', () => {
    expect(formatMiles('')).toBe('')
    expect(formatMiles(null)).toBe('')
    expect(soloDigitos('0005')).toBe('5')
  })
})
