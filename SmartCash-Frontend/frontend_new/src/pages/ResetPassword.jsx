import { useState, useEffect } from 'react'
import { restablecerPasswordRequest } from '../services/authService'
import AuthLayout from '../layout/AuthLayout'
import Input from '../components/Input'

function calculateStrength(pass) {
  if (!pass) return { score: 0, label: 'Sin ingresar', className: '' }

  let score = 0
  if (pass.length >= 8) score += 1
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1
  if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1

  if (score === 1) return { score: 1, label: 'Débil', className: 'active-weak', color: 'var(--danger)' }
  if (score === 2) return { score: 2, label: 'Aceptable', className: 'active-medium', color: 'var(--gold)' }
  return { score: 3, label: 'Fuerte', className: 'active-strong', color: 'var(--mint)' }
}

function ResetPassword({ token, onBack, onResetSuccess, onRequestNewLink }) {
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)

  const hasMinLength = nuevaPassword.length >= 8
  const passwordsMatch = nuevaPassword.length > 0 && nuevaPassword === confirmarPassword
  const canSubmit = hasMinLength && passwordsMatch && Boolean(token)

  const strength = calculateStrength(nuevaPassword)

  // Redirección automática tras éxito (Paso 5)
  useEffect(() => {
    if (!success) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onResetSuccess()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [success, onResetSuccess])

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!token) {
      setError('El enlace no contiene un token válido de recuperación.')
      return
    }

    if (!hasMinLength) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      await restablecerPasswordRequest(token, nuevaPassword)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Si no se proporcionó token en la URL
  if (!token && !success) {
    return (
      <AuthLayout
        title="Enlace inválido"
        subtitle="No se encontró un token de recuperación válido en la URL."
        onBack={onBack}
      >
        <div className="auth-success-card">
          <div className="auth-icon-badge warning-badge">
            !
          </div>

          <h3>Token no encontrado</h3>

          <p className="auth-instruction-text">
            El enlace de recuperación parece estar incompleto o haber expirado.
            Por favor, solicita un nuevo enlace para restablecer tu contraseña.
          </p>

          <button
            type="button"
            className="main-button full-button"
            onClick={onRequestNewLink || onBack}
          >
            Solicitar nuevo enlace
            <span>→</span>
          </button>

          <div className="auth-footer-text">
            <button
              type="button"
              className="auth-link-button"
              onClick={onBack}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={success ? 'Contraseña actualizada' : 'Crea tu nueva contraseña'}
      subtitle={
        success
          ? 'Tu clave ha sido actualizada con éxito.'
          : 'Ingresa y confirma tu nueva contraseña de acceso a SmartCash.'
      }
      onBack={onBack}
    >
      {success ? (
        <div className="auth-success-card">
          <div className="auth-icon-badge success">
            ✓
          </div>

          <h3>¡Tu contraseña ha sido actualizada con éxito!</h3>

          <p className="auth-instruction-text">
            Tu nueva clave ha sido encriptada y guardada. Ahora puedes iniciar
            sesión en tu cuenta de SmartCash.
          </p>

          <div className="redirect-countdown">
            <span>Redirigiendo al inicio de sesión en {countdown} s...</span>
          </div>

          <button
            type="button"
            className="main-button full-button"
            onClick={onResetSuccess}
          >
            Iniciar sesión ahora
            <span>→</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Nueva contraseña"
            type="password"
            value={nuevaPassword}
            onChange={setNuevaPassword}
            placeholder="Mínimo 8 caracteres"
          />

          <Input
            label="Confirmar nueva contraseña"
            type="password"
            value={confirmarPassword}
            onChange={setConfirmarPassword}
            placeholder="Repite tu nueva contraseña"
          />

          {/* Indicador visual de seguridad (mínimo 8 caracteres) */}
          <div className="password-security">
            <div className="security-meter-header">
              <span>Seguridad de la contraseña</span>
              {nuevaPassword && (
                <span
                  className="security-level-tag"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              )}
            </div>

            <div className="security-bars">
              <div
                className={`security-bar-segment ${
                  strength.score >= 1 ? strength.className : ''
                }`}
              />
              <div
                className={`security-bar-segment ${
                  strength.score >= 2 ? strength.className : ''
                }`}
              />
              <div
                className={`security-bar-segment ${
                  strength.score >= 3 ? strength.className : ''
                }`}
              />
            </div>

            <ul className="security-checklist">
              <li
                className={`security-check-item ${
                  hasMinLength ? 'valid' : ''
                }`}
              >
                <span className="check-icon">{hasMinLength ? '✔' : '○'}</span>
                <span>Mínimo 8 caracteres</span>
              </li>
              <li
                className={`security-check-item ${
                  passwordsMatch ? 'valid' : ''
                }`}
              >
                <span className="check-icon">{passwordsMatch ? '✔' : '○'}</span>
                <span>Las contraseñas coinciden</span>
              </li>
            </ul>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="main-button full-button"
            disabled={loading || !canSubmit}
          >
            {loading ? 'Actualizando contraseña...' : 'Cambiar contraseña'}
            {!loading && <span>→</span>}
          </button>

          <div className="auth-footer-text">
            ¿Deseas cancelar?{' '}
            <button
              type="button"
              className="auth-link-button"
              onClick={onBack}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}

export default ResetPassword
