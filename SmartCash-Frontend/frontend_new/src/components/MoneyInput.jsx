import { useLayoutEffect, useRef } from 'react'
import { formatMiles, soloDigitos } from '../utils/helpers'

// Campo de dinero en pesos colombianos: la persona escribe solo números y el
// punto de los miles aparece solo (10000 -> 10.000).
// `value` y `onChange` trabajan con los dígitos "crudos" ("10000"), así el resto
// de la pantalla sigue usando Number(valor) como antes.
export default function MoneyInput({ value, onChange, ...resto }) {
  const ref = useRef(null)
  const digitosAntesDelCursor = useRef(null)
  const texto = formatMiles(value)

  function alEscribir(e) {
    const el = e.target
    const pos = el.selectionStart ?? el.value.length
    digitosAntesDelCursor.current = soloDigitos(el.value.slice(0, pos)).length
    onChange(soloDigitos(el.value))
  }

  // Al reformatear, el cursor se queda junto al dígito que se estaba escribiendo.
  useLayoutEffect(() => {
    const el = ref.current
    const n = digitosAntesDelCursor.current
    if (!el || n === null || document.activeElement !== el) return
    let i = 0
    if (n > 0) {
      let vistos = 0
      for (i = 0; i < texto.length; i++) {
        if (/\d/.test(texto[i])) vistos++
        if (vistos === n) { i++; break }
      }
    }
    el.setSelectionRange(i, i)
    digitosAntesDelCursor.current = null
  })

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={texto}
      onChange={alEscribir}
      {...resto}
    />
  )
}
