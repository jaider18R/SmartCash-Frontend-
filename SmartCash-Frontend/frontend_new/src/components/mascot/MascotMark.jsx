import ChiguiBase from './ChiguiBase'
import './Mascot.css'

// Solo la cabeza con la moneda: es la marca del logo.
export default function MascotMark({ className = '' }) {
  return (
    <svg className={`mascot-mark ${className}`.trim()} viewBox="285 76 150 190" aria-hidden="true">
      <ChiguiBase />
    </svg>
  )
}
