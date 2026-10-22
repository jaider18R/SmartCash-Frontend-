// Accesorios de Chigüi: cada pose es "el mismo chigüiro" + algo que lo conecta con la
// pantalla donde aparece. Las coordenadas son del mismo lienzo que ChiguiBase.
// Las animaciones están en Mascot.css (clases mq-*).

// Gafas redondas sobre el ojo (las usan Inversiones e Historial).
function Gafas() {
  return (
    <g fill="none" stroke="#2a1a10" strokeWidth="4" strokeLinecap="round">
      <circle cx="372" cy="170" r="17" fill="#f4edd2" fillOpacity=".16" />
      <path d="M389 171L406 174M355 166L328 152" />
      <path d="M362 160A14 14 0 0 1 372 156" stroke="#fff" strokeOpacity=".7" strokeWidth="2.4" />
    </g>
  )
}

// Monedas que flotan alrededor (pantalla de inicio y dashboard).
function MonedasFlotantes() {
  const monedas = [
    { x: 96, y: 110, r: 17, clase: 'mq-flota-a' },
    { x: 214, y: 84, r: 12, clase: 'mq-flota-b' },
    { x: 436, y: 92, r: 10, clase: 'mq-flota-c' },
    { x: 60, y: 210, r: 12, clase: 'mq-flota-b' },
  ]
  return (
    <g>
      {monedas.map((m) => (
        <g key={`${m.x}-${m.y}`} className={m.clase}>
          <circle cx={m.x} cy={m.y} r={m.r} fill="url(#mqMoneda)" stroke="#b57d1c" strokeWidth="2" />
          <circle cx={m.x} cy={m.y} r={m.r * 0.62} fill="none" stroke="#a8741a" strokeWidth="1.5" opacity=".6" />
        </g>
      ))}
    </g>
  )
}

// Inversiones: gafas + pizarra con barras que crecen y una flecha de tendencia.
function Inversiones() {
  const barras = [
    { x: 126, h: 20, c: '#eb9e36' },
    { x: 150, h: 32, c: '#eb9e36' },
    { x: 174, h: 26, c: '#fdc400' },
    { x: 198, h: 48, c: '#fdc400' },
    { x: 222, h: 62, c: '#93b6a8' },
  ]
  return (
    <>
      <rect x="108" y="58" width="152" height="94" rx="8" fill="#2d1a23" stroke="#4a2f3a" strokeWidth="2" />
      {barras.map((b, i) => (
        <rect key={b.x} className="mq-barra" style={{ animationDelay: `${i * 0.18}s` }} x={b.x} y={132 - b.h} width="16" height={b.h} rx="2" fill={b.c} />
      ))}
      <path className="mq-linea" d="M122 118L158 102L182 108L214 82L244 72" fill="none" stroke="#f4edd2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M236 70L246 71L242 81" fill="none" stroke="#f4edd2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M118 136H250" stroke="#4a2f3a" strokeWidth="2" />
      <Gafas />
    </>
  )
}

// Escáner: tirilla de factura con una línea de lectura que la recorre.
function Escaner() {
  return (
    <>
      <path d="M170 58H262V150L254 144L246 150L238 144L230 150L222 144L214 150L206 144L198 150L190 144L182 150L170 144Z" fill="#f4edd2" stroke="#c9b99a" strokeWidth="2" />
      <path d="M184 76H248M184 92H236M184 108H248M184 124H224" stroke="#8a6a4a" strokeWidth="3" strokeLinecap="round" />
      <text x="238" y="130" fontSize="12" fontWeight="800" fill="#940540" fontFamily="Manrope, sans-serif">$</text>
      <rect className="mq-escaneo" x="166" y="62" width="100" height="5" rx="2.5" fill="#f46c1c" />
    </>
  )
}

// Historial: libreta de cuentas sobre el lomo y gafas de lectura.
function Historial() {
  return (
    <>
      <g transform="rotate(-6 170 140)">
        <rect x="112" y="96" width="112" height="78" rx="6" fill="#940540" stroke="#5e0a2a" strokeWidth="2" />
        <rect x="120" y="104" width="96" height="62" rx="3" fill="#f4edd2" />
        <path d="M130 120H206M130 134H206M130 148H190" stroke="#c9b99a" strokeWidth="2" />
        <path className="mq-visto mq-visto-1" d="M126 119l4 4 7-8" fill="none" stroke="#5a8f78" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path className="mq-visto mq-visto-2" d="M126 133l4 4 7-8" fill="none" stroke="#5a8f78" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path className="mq-visto mq-visto-3" d="M126 147l4 4 7-8" fill="none" stroke="#5a8f78" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Gafas />
    </>
  )
}

// Presupuestos: calculadora con la pantalla parpadeando.
function Presupuestos() {
  const teclas = [0, 1, 2].flatMap((fila) => [0, 1, 2].map((col) => ({ x: 140 + col * 22, y: 126 + fila * 18, k: `${fila}${col}` })))
  return (
    <>
      <rect x="126" y="76" width="92" height="104" rx="9" fill="#3b2330" stroke="#4a2f3a" strokeWidth="2" />
      <rect x="134" y="84" width="76" height="26" rx="4" fill="#93b6a8" />
      <text className="mq-pantalla" x="204" y="104" textAnchor="end" fontSize="18" fontWeight="800" fill="#1f3a30" fontFamily="Manrope, sans-serif">$ 0</text>
      {teclas.map((t, i) => (
        <circle key={t.k} cx={t.x} cy={t.y} r="7" fill={i === 8 ? '#f46c1c' : '#eb9e36'} opacity={i % 2 ? 0.9 : 1} />
      ))}
    </>
  )
}

// Metas: bandera ondeando sobre el lomo y una pila de monedas que va creciendo.
function Metas() {
  return (
    <>
      <path d="M196 170V70" stroke="#f4edd2" strokeWidth="4" strokeLinecap="round" />
      <path className="mq-bandera" d="M198 72C216 66 226 82 246 76V110C226 116 216 100 198 106Z" fill="#f46c1c" stroke="#a8430a" strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} className="mq-pila" style={{ animationDelay: `${i * 0.5}s` }} cx="368" cy={346 - i * 10} rx="22" ry="8" fill="#fdc400" stroke="#b57d1c" strokeWidth="2" />
      ))}
    </>
  )
}

// Analítica: gráfico circular (dona) que gira despacio.
function Analitica() {
  const segmentos = [
    { color: '#fdc400', largo: 70, desde: 0 },
    { color: '#f46c1c', largo: 54, desde: -70 },
    { color: '#93b6a8', largo: 44, desde: -124 },
    { color: '#ca0034', largo: 44, desde: -168 },
  ]
  return (
    <g className="mq-dona">
      <circle cx="190" cy="112" r="34" fill="#2d1a23" />
      {segmentos.map((s) => (
        <circle key={s.color} cx="190" cy="112" r="34" fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={`${s.largo} 214`} strokeDashoffset={s.desde} />
      ))}
      <circle cx="190" cy="112" r="16" fill="#211219" />
    </g>
  )
}

// Seguridad (inicio de sesión y registro): llave dorada que se balancea.
function Llave() {
  return (
    <g className="mq-llave">
      <circle cx="170" cy="110" r="22" fill="none" stroke="#fdc400" strokeWidth="9" />
      <path d="M190 118L252 146M232 138V158M246 144V164" stroke="#fdc400" strokeWidth="9" strokeLinecap="round" fill="none" />
    </g>
  )
}

export const ACCESORIOS = {
  saludo: MonedasFlotantes,
  inversiones: Inversiones,
  escaner: Escaner,
  historial: Historial,
  presupuestos: Presupuestos,
  metas: Metas,
  analitica: Analitica,
  seguridad: Llave,
}
