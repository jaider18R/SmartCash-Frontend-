import Logo from './Logo'
import './PageShell.css'

// Encabezado + contenedor común de las pantallas internas.
export default function PageShell({ titulo, etiqueta, onBack, children }) {
  return (
    <main className="shell-page">
      <header className="dashboard-header">
        <Logo />
        <button className="back-button dashboard-back" onClick={onBack}>← Dashboard</button>
      </header>
      <section className="shell-content">
        <span className="section-label">{etiqueta}</span>
        <h1 className="shell-title">{titulo}</h1>
        {children}
      </section>
    </main>
  )
}
