import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import Mascot from '../components/mascot/Mascot'
import './Dashboard.css'

function Dashboard({ onTransaction, onHistory, onBudgets, onGoals, onInvestments, onAnalytics, onLogout }) {
  const { user } = useAuth()
  const correo = user?.correo || 'Usuario'

  return (
    <main className="dashboard-page">
      <header className="topbar">
        <Logo />

        <div className="dashboard-user">
          <div className="avatar">{correo.charAt(0).toUpperCase()}</div>

          <div className="user-info">
            <span>Sesión activa</span>
            <strong>{correo}</strong>
          </div>

          <button className="back-button" onClick={onLogout}>
            Salir
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="welcome-card photo photo-monedas">
          <div className="welcome-text">
            <span className="section-label">SmartCash</span>

            <h1>
              Tu espacio financiero
              <span> empieza aquí.</span>
            </h1>

            <p>
              Registra tus movimientos y deja que SmartCash organice automáticamente la información.
            </p>

            <button className="main-button" onClick={onTransaction}>
              Nueva transacción
              <span>+</span>
            </button>
          </div>

          <Mascot pose="saludo" className="welcome-mascot" />
        </div>

        <div className="nav-cards">
          <button className="nav-card" onClick={onHistory}><strong>Historial</strong><span className="muted">Filtra, edita y elimina tus movimientos</span></button>
          <button className="nav-card" onClick={onBudgets}><strong>Presupuestos</strong><span className="muted">Límites mensuales por categoría</span></button>
          <button className="nav-card" onClick={onGoals}><strong>Metas de ahorro</strong><span className="muted">Abona, retira y mira tu progreso</span></button>
          <button className="nav-card" onClick={onAnalytics}><strong>Analítica</strong><span className="muted">Resumen del mes, gasto seguro diario y simulador de compras</span></button>
          <button className="nav-card" onClick={onInvestments}><strong>Inversiones</strong><span className="muted">Simulador, MPF Invest y Alto Rendimiento</span></button>
        </div>

        <div className="dashboard-grid">
          <button className="info-card" onClick={onTransaction}>
            <h3>Escáner de facturas</h3>
            <p>Toma foto o sube tu factura: extrae los datos en memoria y registra el gasto sin guardar imágenes.</p>
          </button>

          <div className="info-card">
            <h3>Categorización con IA</h3>
            <p>El modelo clasifica automáticamente el comercio y detecta gastos inusuales.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
