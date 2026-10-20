// Cliente HTTP único: agrega el token, interpreta el error {"error": "..."} del
// backend y avisa cuando la sesión expiró (401/403) para cerrar sesión.
import { STORAGE_KEYS } from '../utils/constants'

export async function apiFetch(url, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response
  try {
    response = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new Error('No hay conexión con el servidor. Verifica que los microservicios estén encendidos.')
  }

  if (auth && (response.status === 401 || response.status === 403)) {
    window.dispatchEvent(new Event('smartcash:sesion-expirada'))
    throw new Error('Tu sesión expiró. Inicia sesión de nuevo.')
  }

  const text = await response.text()
  let data
  try { data = text ? JSON.parse(text) : null } catch { data = null }

  if (!response.ok) {
    throw new Error(data?.error || data?.mensaje || (typeof data?.detail === 'string' ? data.detail : null) || `Error ${response.status} del servidor`)
  }
  return data
}
