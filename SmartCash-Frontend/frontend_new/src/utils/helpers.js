// Antes vivía dentro de Transaction.jsx. Se mueve aquí porque es una función
// utilitaria pura (no depende de React ni de ningún componente), que es
// exactamente lo que va en utils/.
//
// Decodifica el payload del JWT (sin verificar la firma, eso ya lo hace el
// backend) para leer el campo "id_usuario" que el backend incluye en el token.
// Así el usuario nunca tiene que escribir su propio ID a mano.
export function getUserIdFromToken(jwt) {
  try {
    const payload = jwt.split('.')[1]

    const decoded = JSON.parse(
      atob(
        payload
          .replace(/-/g, '+')
          .replace(/_/g, '/')
      )
    )

    return decoded.id_usuario
  } catch {
    return null
  }
}

// Moneda colombiana: $ 1.250.000
export function formatCOP(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(Number(valor) || 0)
}

// Umbrales pedidos: verde <80 %, naranja 80 %–<100 %, rojo >=100 %.
export function nivelPresupuesto(porcentaje) {
  if (porcentaje >= 100) return 'rojo'
  if (porcentaje >= 80) return 'naranja'
  return 'verde'
}

// Gasto del mes por categoría a partir de las transacciones reales del backend.
export function gastoPorCategoria(transacciones, mes, anio) {
  const totales = {}
  transacciones.forEach((t) => {
    if (t.tipoMovimiento !== 'gasto' || !t.idCategoria || !t.fecha) return
    const [y, m] = t.fecha.split('-').map(Number)
    if (y === anio && m === mes) totales[t.idCategoria] = (totales[t.idCategoria] || 0) + Number(t.monto)
  })
  return totales
}

// ---- Campos de dinero (pesos colombianos) ----
// Deja solo los dígitos de lo que escribe la persona ("1.250abc" -> "1250").
export function soloDigitos(texto) {
  return String(texto ?? '').replace(/\D/g, '').replace(/^0+(?=\d)/, '')
}

// Pone el punto de los miles al mostrar: "10000" -> "10.000".
// Si llega un decimal del servidor ("25000.00") se redondea a pesos enteros.
export function formatMiles(valor) {
  let s = String(valor ?? '')
  if (/^\d+\.\d+$/.test(s)) s = String(Math.round(Number(s)))
  return soloDigitos(s).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
