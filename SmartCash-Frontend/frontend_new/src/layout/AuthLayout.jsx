import Logo from '../components/Logo'
import Mascot from '../components/mascot/Mascot'
import './AuthLayout.css'

// Marco de las pantallas sin sesión: panel de marca con foto + tarjeta del formulario.
function AuthLayout({ title, subtitle, onBack, children }) {
  return (
    <main className="auth-page">
      <aside className="auth-brand photo photo-monedas">
        <Logo />

        <div className="auth-message">
          <h1>
            Tu dinero.
            <br />
            <span>Más inteligente.</span>
          </h1>
          <p>Registra, controla y haz crecer tus finanzas en pesos colombianos.</p>
        </div>

        <Mascot pose="seguridad" className="auth-mascot" />
      </aside>

      <section className="auth-panel">
        <button className="back-button" onClick={onBack}>
          ← Volver
        </button>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          {children}
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
