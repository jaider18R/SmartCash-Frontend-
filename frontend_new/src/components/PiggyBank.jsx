import './PiggyBank.css'

// Ilustración de la alcancía hecha con divs + CSS (sin SVG ni imágenes).
// Se usa únicamente en Home, pero se deja como componente aparte porque es
// una pieza visual independiente y bastante grande.
//
// Nota: las clases piggy-body, piggy-ear, piggy-eye, piggy-snout,
// snout-hole, piggy-smile, piggy-slot, piggy-tail, piggy-leg, piggy-ring y
// coin-four no tenían estilos definidos en el proyecto original (se revisó
// todo App.css y no existen). No se agregaron estilos nuevos para no
// cambiar el resultado visual que el profesor ya vio; si en algún momento
// quieren dibujar el cuerpo completo del cerdito, esas clases son el punto
// de partida.
function PiggyBank() {
  return (
    <div className="piggy-container">
      {/* Brillo detrás de la alcancía */}
      <div className="piggy-glow"></div>

      {/* Monedas flotantes */}
      <div className="coin coin-one">$</div>
      <div className="coin coin-two">$</div>
      <div className="coin coin-three">$</div>
      <div className="coin coin-four">$</div>

      {/* Anillos luminosos */}
      <div className="piggy-ring ring-one"></div>
      <div className="piggy-ring ring-two"></div>

      {/* Alcancía */}
      <div className="piggy">

        {/* Cuerpo */}
        <div className="piggy-body">

          {/* Brillo superior */}
          <div className="piggy-highlight"></div>

          {/* Oreja izquierda */}
          <div className="piggy-ear ear-left"></div>

          {/* Oreja derecha */}
          <div className="piggy-ear ear-right"></div>

          {/* Ojo izquierdo */}
          <div className="piggy-eye eye-left"></div>

          {/* Ojo derecho */}
          <div className="piggy-eye eye-right"></div>

          {/* Hocico */}
          <div className="piggy-snout">
            <div className="snout-hole hole-left"></div>
            <div className="snout-hole hole-right"></div>
          </div>

          {/* Sonrisa */}
          <div className="piggy-smile"></div>

          {/* Ranura para monedas */}
          <div className="piggy-slot"></div>

          {/* Cola */}
          <div className="piggy-tail"></div>

          {/* Patas */}
          <div className="piggy-leg leg-one"></div>
          <div className="piggy-leg leg-two"></div>
          <div className="piggy-leg leg-three"></div>
          <div className="piggy-leg leg-four"></div>
        </div>

        {/* Texto SmartCash */}
        <div className="piggy-label">
          <span>SMART</span>
          <strong>$</strong>
          <span>CASH</span>
        </div>
      </div>
    </div>
  )
}

export default PiggyBank
