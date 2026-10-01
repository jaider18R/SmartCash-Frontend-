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
