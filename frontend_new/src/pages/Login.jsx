import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loginRequest } from '../services/authService'
import AuthLayout from '../layout/AuthLayout'
import Input from '../components/Input'

// No tiene Login.css propio: todo lo que usa (auth-page, auth-card,
// input-group, main-button, error-message...) ya está en
// layout/AuthLayout.css y styles/shared.css.
function Login({ onBack, onLoginSuccess }) {
  const { login } = useAuth()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = await loginRequest(correo, password)

      // Guarda el token y el correo del usuario en el contexto de
      // autenticación (que a su vez los persiste en localStorage).
      login(data.token, { correo })

      onLoginSuccess()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Ingresa a SmartCash y continúa organizando tus finanzas."
      onBack={onBack}
    >

      <form onSubmit={handleSubmit}>

        <Input
          label="Correo electrónico"
          type="email"
          value={correo}
          onChange={setCorreo}
          placeholder="tu@correo.com"
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          className="main-button full-button"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
          {!loading && <span>→</span>}
        </button>

      </form>

    </AuthLayout>
  )
}

export default Login
