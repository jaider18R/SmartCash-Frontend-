// Llamada HTTP al microservicio transacciones-service (puerto 8082 detrás
// del proxy de Vite). Antes estaba escrita directamente dentro de
// Transaction.jsx; misma ruta, mismo body, mismo header — solo se movió.
export async function registrarTransaccion(token, { idUsuario, monto, fecha, comercio, tipoMovimiento }) {
  const response = await fetch('/api/transacciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idUsuario,
      monto,
      fecha,
      comercio,
      tipoMovimiento,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'No fue posible registrar la transacción')
  }

  return data
}
