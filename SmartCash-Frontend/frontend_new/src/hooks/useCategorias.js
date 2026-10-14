import { useEffect, useState } from 'react'
import { listarCategorias } from '../services/categoriasService'

// Catálogo real del backend (con color e icono). Si falla, queda vacío y se avisa.
export function useCategorias() {
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    let vivo = true
    listarCategorias()
      .then((d) => { if (vivo) setCategorias(d || []) })
      .catch((e) => { if (vivo) setError(e.message) })
    return () => { vivo = false }
  }, [])
  const porId = Object.fromEntries(categorias.map((c) => [c.idCategoria, c]))
  return { categorias, porId, error }
}
