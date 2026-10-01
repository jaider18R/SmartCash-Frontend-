// Claves usadas para guardar la sesión en localStorage.
// Antes estos strings ('smartcash_token', 'smartcash_user') estaban repetidos
// sueltos dentro de App.jsx. Se centralizan aquí para no tener "strings mágicos"
// repetidos en varios archivos.
export const STORAGE_KEYS = {
  TOKEN: 'smartcash_token',
  USER: 'smartcash_user',
}
