import { useState } from 'react'
import { registroRequest } from '../services/authService'
import AuthLayout from '../layout/AuthLayout'
import Input from '../components/Input'

// Tampoco tiene Register.css propio, por la misma razón que Login.
function Register({ onBack, onRegistered }) {

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await registroRequest(nombre, correo, password)

      setSuccess('Cuenta creada correctamente. Ahora puedes iniciar sesión.')

      setTimeout(() => {
        onRegistered()
      }, 1200)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a organizar tus movimientos financieros con SmartCash."
      onBack={onBack}
    >

      <form onSubmit={handleSubmit}>

        <Input
          label="Nombre"
          value={nombre}
          onChange={setNombre}
          placeholder="Tu nombre"
        />

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
          placeholder="Mínimo 8 caracteres"
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <button
          className="main-button full-button"
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          {!loading && <span>→</span>}
        </button>

      </form>

    </AuthLayout>
  )
}

export default Register
