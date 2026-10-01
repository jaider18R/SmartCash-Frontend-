import { createContext, useContext, useState } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

// Antes el token y el usuario vivían como useState directamente en
// App.jsx y se pasaban a mano como props a Dashboard y Transaction
// (prop drilling). Se mueve a un Context para que cualquier página pueda
// leer la sesión con useAuth() sin que App.jsx tenga que reenviarla.
// El comportamiento es exactamente el mismo: mismo localStorage, mismas
// claves, mismos datos guardados.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.TOKEN))
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null')
  )

  function login(newToken, userData) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
    setToken(newToken)

    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
      setUser(userData)
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- patrón estándar de Context + hook en un mismo archivo
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }

  return context
}
