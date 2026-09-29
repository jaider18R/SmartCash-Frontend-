import Logo from '../components/Logo'
import PiggyBank from '../components/PiggyBank'
import './Home.css'

function Home({ onLogin, onRegister }) {
  return (
    <main className="home">

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <nav className="navbar">
        <Logo />

        <div className="nav-links">
          <button onClick={onLogin} className="nav-button">
            Iniciar sesión
          </button>

          <button onClick={onRegister} className="nav-button primary-small">
            Registrarse
          </button>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-content">

          <div className="eyebrow">
            <span>●</span>
            FINANZAS PERSONALES, MÁS INTELIGENTES
          </div>

          <h1>
            Haz que tu dinero
            <span> trabaje contigo.</span>
          </h1>

          <p className="hero-description">
            SmartCash te ayuda a registrar y organizar tus movimientos
            financieros de una forma sencilla, visual y pensada para ti.
          </p>

          <div className="hero-buttons">

            <button
              className="main-button"
              onClick={onLogin}
            >
              Iniciar sesión
              <span>→</span>
            </button>

            <button
              className="secondary-button"
              onClick={onRegister}
            >
              Crear cuenta
            </button>

          </div>

          <div className="hero-info">
            <span>🇨🇴</span>
            Diseñado pensando en las finanzas colombianas
          </div>

        </div>

        <PiggyBank />

      </section>

    </main>
  )
}

export default Home
