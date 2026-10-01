import Logo from '../components/Logo'
import './AuthLayout.css'


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
