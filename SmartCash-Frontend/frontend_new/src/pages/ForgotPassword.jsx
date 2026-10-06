import { useState } from 'react'
import { solicitarRecuperacionRequest } from '../services/authService'
import AuthLayout from '../layout/AuthLayout'
import Input from '../components/Input'

function ForgotPassword({ onBack, onGoToLogin }) {
  const [correo, setCorreo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await solicitarRecuperacionRequest(correo.trim())
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle={
        submitted
          ? 'Revisa las instrucciones que enviamos a tu correo.'
          : 'Ingresa tu correo para recibir las instrucciones de recuperación.'
      }
      onBack={onBack}
    >
      {submitted ? (
        <div className="auth-success-card">
          <div className="auth-icon-badge">
            ✉️
          </div>

          <h3>¡Correo enviado!</h3>

          <p className="auth-instruction-text">
            Te hemos enviado un correo con las instrucciones para restablecer tu
            contraseña a <strong>{correo}</strong>. Revisa tu bandeja de
            entrada o carpeta de spam.
          </p>

          <div className="auth-notice-box">
            <span>⏱️</span>
            <span>El enlace de recuperación es válido solo durante los próximos 15 minutos.</span>
          </div>

          <button
            type="button"
            className="main-button full-button"
            onClick={onGoToLogin}
          >
            Volver a Iniciar sesión
            <span>→</span>
          </button>

          <div className="auth-footer-text">
            ¿No recibiste el correo?{' '}
            <button
              type="button"
              className="auth-link-button"
              onClick={() => {
                setSubmitted(false)
                setError('')
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Ingresa tu correo electrónico registrado"
            type="email"
            value={correo}
            onChange={setCorreo}
            placeholder="tu@correo.com"
          />

          {error && <div className="error-message">{error}</div>}

          <button
            className="main-button full-button"
            disabled={loading || !correo.trim()}
          >
            {loading ? 'Enviando instrucciones...' : 'Enviar instrucciones'}
            {!loading && <span>→</span>}
          </button>

          <div className="auth-footer-text">
            ¿Recordaste tu contraseña?{' '}
            <button
              type="button"
              className="auth-link-button"
              onClick={onBack}
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPassword
