import Logo from '../components/Logo'
import Mascot from '../components/mascot/Mascot'
import './Home.css'

function Home({ onLogin, onRegister }) {
  return (
    <main className="home">
      <nav className="navbar">
        <Logo />

        <div className="nav-links">
          <button onClick={onLogin} className="back-button">
            Iniciar sesión
          </button>
          <button onClick={onRegister} className="small-button">
            Registrarse
          </button>
        </div>
      </nav>

      <section className="hero photo photo-monedas">
        <div className="hero-content">
          <span className="section-label">Finanzas personales para Colombia</span>

          <h1>
            Haz que tu dinero
            <span> trabaje contigo.</span>
          </h1>

          <p className="hero-description">
            SmartCash te ayuda a registrar y organizar tus movimientos
            financieros de una forma sencilla, visual y pensada para ti.
          </p>

          <div className="hero-buttons">
            <button className="main-button" onClick={onLogin}>
              Iniciar sesión
              <span>→</span>
            </button>

            <button className="secondary-button" onClick={onRegister}>
              Crear cuenta
            </button>
          </div>
        </div>

        <Mascot pose="saludo" className="hero-mascot" />
      </section>

      <section className="home-features">
        <article>
          <h3>Registra sin esfuerzo</h3>
          <p>Escanea tus facturas o anota un movimiento en segundos. La categoría la pone la IA.</p>
        </article>
        <article>
          <h3>Controla tus límites</h3>
          <p>Presupuestos por categoría y metas de ahorro con seguimiento claro de tu progreso.</p>
        </article>
        <article>
          <h3>Decide con datos</h3>
          <p>Resumen mensual, gasto seguro diario y simulador de inversiones en pesos colombianos.</p>
        </article>
      </section>
    </main>
  )
}

export default Home
