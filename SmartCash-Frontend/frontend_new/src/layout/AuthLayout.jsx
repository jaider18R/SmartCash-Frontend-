import Logo from '../components/Logo'
import './AuthLayout.css'

// Envoltorio visual compartido por Login y Register: el botón de "volver",
// la marca a la izquierda y la tarjeta del formulario a la derecha.
// Es lo más parecido a un "layout" real que existe en este proyecto (por
// eso vive en layout/ y no en pages/): no es una pantalla en sí misma,
// es el marco que usan dos pantallas distintas.
function AuthLayout({ title, subtitle, onBack, children }) {

  return (
    <main className="auth-page">

      <div className="auth-decoration decoration-one"></div>
      <div className="auth-decoration decoration-two"></div>

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Volver
      </button>

      <div className="auth-wrapper">

        <div className="auth-brand">
          <Logo />

          <div className="auth-message">
            <h1>
              Tu dinero.
              <br />
              <span>Más inteligente.</span>
            </h1>
          </div>
        </div>

        <div className="auth-card">

          <div className="auth-card-header">

            <div className="mini-icon">
              $
            </div>

            <h2>{title}</h2>

            <p>{subtitle}</p>

          </div>

          {children}

        </div>

      </div>

    </main>
  )
}

export default AuthLayout
