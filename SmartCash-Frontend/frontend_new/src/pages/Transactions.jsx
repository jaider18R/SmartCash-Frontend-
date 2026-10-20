import { useCallback, useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import MoneyInput from '../components/MoneyInput'
import ConfirmDialog from '../components/ConfirmDialog'
import { useCategorias } from '../hooks/useCategorias'
import { listarTransacciones, actualizarTransaccion, eliminarTransaccion } from '../services/transaccionesService'
import { formatCOP } from '../utils/helpers'

const VACIOS = { tipo: '', categoriaId: '', buscar: '', desde: '', hasta: '' }

export default function Transactions({ onBack }) {
  const { categorias, porId } = useCategorias()
  const [filtros, setFiltros] = useState(VACIOS)
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(null)
  const [aBorrar, setABorrar] = useState(null)
  const [borrando, setBorrando] = useState(false)

  const cargar = useCallback(async (f) => {
    try {
      const d = await listarTransacciones(f)
      setError('')
      setItems([...(d || [])].sort((a, b) => b.fecha.localeCompare(a.fecha)))
    } catch (e) { setError(e.message) } finally { setCargando(false) }
  }, [])

  const recargar = (f) => { setCargando(true); cargar(f) }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos; el setState ocurre tras el await
  useEffect(() => { cargar(VACIOS) }, [cargar])

  const set = (k) => (e) => setFiltros({ ...filtros, [k]: e.target.value })

  async function guardarEdicion(e) {
    e.preventDefault(); setError('')
    if (Number(editando.monto) <= 0 || !editando.comercio.trim()) { setError('Monto mayor a cero y comercio obligatorio.'); return }
    try {
      await actualizarTransaccion(editando.idTransaccion, {
        monto: Number(editando.monto), fecha: editando.fecha, comercio: editando.comercio.trim(),
        tipoMovimiento: editando.tipoMovimiento, idCategoria: editando.idCategoria || null,
      })
      setEditando(null); recargar(filtros)
    } catch (err) { setError(err.message) }
  }

  async function confirmarBorrado() {
    setBorrando(true)
    try { await eliminarTransaccion(aBorrar.idTransaccion); setABorrar(null); recargar(filtros) }
    catch (err) { setError(err.message); setABorrar(null) } finally { setBorrando(false) }
  }

  return (
    <PageShell etiqueta="HISTORIAL" titulo="Mis transacciones" onBack={onBack}>
      <form className="panel grid-form" onSubmit={(e) => { e.preventDefault(); recargar(filtros) }}>
        <div className="input-group"><label>Tipo</label>
          <select value={filtros.tipo} onChange={set('tipo')}>
            <option value="">Todos</option><option value="gasto">Gasto</option><option value="ingreso">Ingreso</option>
          </select></div>
        <div className="input-group"><label>Categoría</label>
          <select value={filtros.categoriaId} onChange={set('categoriaId')}>
            <option value="">Todas</option>
            {categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
          </select></div>
        <div className="input-group"><label>Comercio</label>
          <input value={filtros.buscar} onChange={set('buscar')} placeholder="Buscar..." /></div>
        <div className="input-group"><label>Desde</label><input type="date" value={filtros.desde} onChange={set('desde')} /></div>
        <div className="input-group"><label>Hasta</label><input type="date" value={filtros.hasta} onChange={set('hasta')} /></div>
        <div className="row-actions">
          <button className="small-button" type="submit">Filtrar</button>
          <button className="ghost-button" type="button" onClick={() => { setFiltros(VACIOS); recargar(VACIOS) }}>Limpiar</button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
      {cargando && <p className="muted">Cargando...</p>}
      {!cargando && !items.length && !error && <p className="muted">No hay transacciones para mostrar.</p>}

      <div className="list">
        {items.map((t) => {
          const cat = porId[t.idCategoria]
          return (
            <div className="row-item" key={t.idTransaccion}>
              <div className="row-main">
                <div className="cat-dot" style={cat?.color ? { background: cat.color } : undefined}>{cat?.icono || '•'}</div>
                <div>
                  <strong>{t.comercio}</strong>
                  <div className="muted">{t.fecha} · {cat?.nombre || 'Sin categoría'}
                    {t.confianzaCategorizacion != null && ` · confianza IA ${(t.confianzaCategorizacion * 100).toFixed(0)}%`}</div>
                </div>
              </div>
              <span className={t.tipoMovimiento === 'gasto' ? 'amount-gasto' : 'amount-ingreso'}>
                {t.tipoMovimiento === 'gasto' ? '-' : '+'}{formatCOP(t.monto)}
              </span>
              <div className="row-actions">
                <button className="ghost-button" onClick={() => setEditando({ ...t, monto: String(Math.round(Number(t.monto))) })}>Editar</button>
                <button className="danger-button" onClick={() => setABorrar(t)}>Eliminar</button>
              </div>
            </div>
          )
        })}
      </div>

      {editando && (
        <div className="modal-backdrop">
          <form className="modal-box" onSubmit={guardarEdicion}>
            <h2>Editar transacción</h2>
            <div className="input-group"><label>Comercio</label>
              <input value={editando.comercio} onChange={(e) => setEditando({ ...editando, comercio: e.target.value })} required /></div>
            <div className="input-group"><label>Monto</label>
              <MoneyInput value={editando.monto} onChange={(v) => setEditando({ ...editando, monto: v })} required /></div>
            <div className="input-group"><label>Fecha</label>
              <input type="date" value={editando.fecha} onChange={(e) => setEditando({ ...editando, fecha: e.target.value })} required /></div>
            <div className="input-group"><label>Tipo</label>
              <select value={editando.tipoMovimiento} onChange={(e) => setEditando({ ...editando, tipoMovimiento: e.target.value })}>
                <option value="gasto">Gasto</option><option value="ingreso">Ingreso</option></select></div>
            <div className="input-group"><label>Categoría (corrección manual)</label>
              <select value={editando.idCategoria || ''} onChange={(e) => setEditando({ ...editando, idCategoria: e.target.value })}>
                <option value="">Sin cambio / sin categoría</option>
                {categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
              </select></div>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="small-button">Guardar cambios</button>
            </div>
          </form>
        </div>
      )}
      {aBorrar && (
        <ConfirmDialog cargando={borrando} onCancel={() => setABorrar(null)} onConfirm={confirmarBorrado}
          mensaje={`¿Eliminar la transacción de "${aBorrar.comercio}" por ${formatCOP(aBorrar.monto)}? Esta acción no se puede deshacer.`} />
      )}
    </PageShell>
  )
}
