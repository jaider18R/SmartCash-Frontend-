import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import './Dashboard.css'


function Dashboard({ onTransaction, onLogout }) {

  const { user } = useAuth()
  const correo = user?.correo || 'Usuario'

  return (
    <main className="dashboard-page">

      <header className="dashboard-header">

        <Logo />

        <div className="dashboard-user">

          <div className="avatar">
            {correo.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <span>Sesión activa</span>
            <strong>{correo}</strong>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Salir
          </button>

        </div>

      </header>

      <section className="dashboard-content">

        <div className="welcome-card">

          <div>

            <span className="section-label">
              SMARTCASH
            </span>

            <h1>
              Tu espacio financiero
              <span> empieza aquí.</span>
            </h1>

            <p>
              Registra tus movimientos y deja que SmartCash
              organice automáticamente la información.
            </p>

            <button
              className="main-button"
              onClick={onTransaction}
            >
              Nueva transacción
              <span>+</span>
            </button>

          </div>

          <div className="dashboard-illustration">
            <div className="floating-coin big">$</div>
            <div className="floating-coin small">$</div>

            <div className="dashboard-circle">
              💰
            </div>
          </div>

        </div>

        <div className="dashboard-grid">

          <div className="info-card">

            <div className="info-icon blue">
              +
            </div>

            <div>
              <h3>Registrar movimiento</h3>
              <p>
                Añade un ingreso o gasto de manera rápida.
              </p>
            </div>

          </div>

          <div className="info-card">

            <div className="info-icon purple">
              ✦
            </div>

            <div>
              <h3>Categorización</h3>
              <p>
                El backend analiza automáticamente el comercio.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

export default Dashboard
