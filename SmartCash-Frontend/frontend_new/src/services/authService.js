// Llamadas HTTP al microservicio usuarios-auth (puerto 8081 detrás del proxy
// de Vite, ver vite.config.js). Antes el fetch estaba escrito directamente
// dentro de Login.jsx y Register.jsx; se mueve aquí para separar "cómo hablo
// con el backend" de "cómo se ve la pantalla".
//
// Las rutas NO cambiaron: siguen siendo las mismas que ya usaba el proyecto.
const AUTH_BASE = '/api/auth'

export async function loginRequest(correo, password) {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Correo o contraseña incorrectos')
  }

  return data // { token, tipo }
}

export async function registroRequest(nombre, correo, password) {
  const response = await fetch(`${AUTH_BASE}/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, correo, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'No fue posible crear la cuenta')
  }

  return data
}
