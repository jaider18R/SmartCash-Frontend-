// Dibujo base de Chigüi (el chigüiro) en un lienzo de 440x330 (viewBox "20 50 440 330").
// Todas las poses reutilizan este dibujo y le suman un accesorio (ver accesorios.jsx),
// así no hay chigüiros duplicados. Los colores del pelaje y la moneda son propios del dibujo.

const FUENTE = 'Fraunces, Georgia, serif'

export default function ChiguiBase() {
  return (
    <>
      <defs>
        <linearGradient id="mqCuerpo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9884a" />
          <stop offset=".6" stopColor="#a96a33" />
          <stop offset="1" stopColor="#8a5326" />
        </linearGradient>
        <linearGradient id="mqCabeza" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d79a58" />
          <stop offset="1" stopColor="#a96a33" />
        </linearGradient>
        <linearGradient id="mqPata" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a96a33" />
          <stop offset="1" stopColor="#7e4a22" />
        </linearGradient>
        <radialGradient id="mqMoneda" cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#fff3a6" />
          <stop offset=".5" stopColor="#ffd166" />
          <stop offset="1" stopColor="#c98a1d" />
        </radialGradient>
      </defs>

      {/* Sombra y agua */}
      <ellipse cx="236" cy="356" rx="190" ry="10" fill="#000" opacity=".28" />
      <ellipse cx="236" cy="354" rx="170" ry="7" fill="none" stroke="#93b6a8" strokeOpacity=".3" strokeWidth="2" />
      <ellipse cx="236" cy="354" rx="205" ry="11" fill="none" stroke="#93b6a8" strokeOpacity=".15" strokeWidth="2" />

      {/* Patas lejanas y cercanas */}
      <path d="M232 292C230 322 232 340 236 350L262 350C266 338 268 318 266 292Z" fill="#6f4120" />
      <path d="M150 276C146 312 154 338 160 350L186 350C188 330 188 310 192 290Z" fill="#6f4120" />
      <path d="M268 286C266 316 268 338 272 350L300 350C304 336 306 316 304 286Z" fill="url(#mqPata)" />
      <path d="M96 268C88 308 96 338 102 350L136 350C138 330 138 308 146 286Z" fill="url(#mqPata)" />

      {/* Cuerpo, vientre y pelaje */}
      <path d="M64 262C58 214 92 170 160 160C220 152 280 160 312 188C330 206 332 250 316 280C300 312 250 322 190 322C120 322 70 310 64 262Z" fill="url(#mqCuerpo)" />
      <path d="M90 296C130 322 270 328 312 288C300 316 250 330 190 330C130 330 98 318 90 296Z" fill="#dcaa6e" opacity=".85" />
      <path d="M100 214C122 186 160 170 210 168C250 166 284 174 308 192" fill="none" stroke="#ffd9a0" strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M104 236l16 6M132 214l14 8M170 200l12 8M210 194l12 6M248 198l12 8M92 270l16 4M126 262l16 4M160 250l14 6M196 242l14 6M238 246l12 6M274 236l12 6"
        fill="none" stroke="#5e3718" strokeOpacity=".4" strokeWidth="2.6" strokeLinecap="round"
      />
      <path d="M272 350v-8M283 350v-10M294 350v-8M102 350v-8M114 350v-10M126 350v-8" stroke="#3a2210" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity=".6" />

      {/* Cabeza */}
      <path d="M300 170C318 140 366 134 396 150C420 162 430 190 426 214C422 240 402 256 372 258C338 260 304 248 296 224C292 206 292 186 300 170Z" fill="url(#mqCabeza)" />
      <path d="M302 226C322 254 384 266 424 232C412 256 374 266 342 258C318 252 304 240 302 226Z" fill="#dcaa6e" opacity=".9" />
      <ellipse cx="319" cy="150" rx="12" ry="10" fill="#8a5326" transform="rotate(-20 319 150)" />
      <ellipse cx="320" cy="151" rx="6" ry="5" fill="#4b2c12" transform="rotate(-20 320 151)" />
      <ellipse cx="418" cy="176" rx="11" ry="14" fill="#2c180a" />
      <ellipse cx="415" cy="171" rx="3.6" ry="4.6" fill="#8a6a4a" opacity=".8" />
      <g className="mq-blink">
        <circle cx="372" cy="170" r="7.5" fill="#1a0e06" />
        <circle cx="374.5" cy="167.5" r="2.5" fill="#fff" />
      </g>
      <path d="M340 160C350 152 364 152 372 158" fill="none" stroke="#5e3718" strokeOpacity=".5" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M382 234Q402 240 418 228" fill="none" stroke="#4b2c12" strokeWidth="2.6" strokeLinecap="round" />
      <g fill="#4b2c12" opacity=".6">
        <circle cx="404" cy="206" r="1.8" />
        <circle cx="396" cy="212" r="1.8" />
        <circle cx="410" cy="214" r="1.8" />
      </g>

      {/* Moneda sobre la cabeza (se mece suavemente) */}
      <g className="mq-coin">
        <g transform="rotate(-14 354 116)">
          <circle cx="356" cy="119" r="30" fill="#8a5d0e" opacity=".3" />
          <circle cx="354" cy="116" r="29" fill="url(#mqMoneda)" stroke="#b57d1c" strokeWidth="2" />
          <circle cx="354" cy="116" r="25" fill="none" stroke="#a8741a" strokeWidth="2" strokeDasharray="2.4 2.4" opacity=".55" />
          <circle cx="354" cy="116" r="18" fill="#ffe08a" stroke="#c48b25" strokeWidth="1.4" />
          <text x="353" y="126" textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff6c4" fontFamily={FUENTE}>$</text>
          <text x="354" y="127" textAnchor="middle" fontSize="26" fontWeight="800" fill="#a9761a" fontFamily={FUENTE}>$</text>
        </g>
      </g>
    </>
  )
}
