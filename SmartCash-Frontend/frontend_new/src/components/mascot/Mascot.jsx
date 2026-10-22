import ChiguiBase from './ChiguiBase'
import { ACCESORIOS } from './accesorios'
import './Mascot.css'

// Chigüi, la mascota de SmartCash. `pose` elige qué hace según la pantalla:
// saludo | inversiones | escaner | historial | presupuestos | metas | analitica | seguridad
export default function Mascot({ pose = 'saludo', className = '' }) {
  const Accesorio = ACCESORIOS[pose] ?? ACCESORIOS.saludo
  return (
    <svg
      className={`mascot ${className}`.trim()}
      viewBox="20 50 440 330"
      role="img"
      aria-label="Chigüi, el chigüiro mascota de SmartCash"
    >
      <ChiguiBase />
      <Accesorio />
    </svg>
  )
}
