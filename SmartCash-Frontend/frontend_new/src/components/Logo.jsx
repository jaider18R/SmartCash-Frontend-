import MascotMark from './mascot/MascotMark'
import './Logo.css'

// Logo de SmartCash: la cabeza de Chigüi con su moneda + el nombre.
function Logo() {
  return (
    <div className="logo">
      <MascotMark />
      <div className="logo-text">
        <strong>Smart</strong>
        <span>Cash</span>
      </div>
    </div>
  )
}

export default Logo
