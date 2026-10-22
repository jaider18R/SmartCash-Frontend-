import Logo from './Logo'
import Mascot from './mascot/Mascot'
import './PageShell.css'

// Marco común de las pantallas internas: barra superior + banda de título con foto
// de fondo y la mascota en la pose de la pantalla.
//   imagen: 'monedas' | 'alcancia'   pose: ver components/mascot/Mascot.jsx
export default function PageShell({ titulo, etiqueta, descripcion, pose, imagen = 'monedas', onBack, children }) {
  return (
    <main className="shell-page">
      <header className="topbar">
        <Logo />
        <button className="back-button" onClick={onBack}>← Dashboard</button>
      </header>

      <section className={`shell-hero photo photo-${imagen}`}>
        <div className="shell-hero-inner">
          <div className="shell-hero-text">
            <span className="section-label">{etiqueta}</span>
            <h1 className="shell-title">{titulo}</h1>
            {descripcion && <p className="shell-description">{descripcion}</p>}
          </div>
          <Mascot pose={pose} className="shell-mascot" />
        </div>
      </section>

      <section className="shell-content">{children}</section>
    </main>
  )
}
