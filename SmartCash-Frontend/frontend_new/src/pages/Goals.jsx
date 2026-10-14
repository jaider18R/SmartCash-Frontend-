import { useCallback, useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import ConfirmDialog from '../components/ConfirmDialog'
import { listarMetas, crearMeta, abonarMeta, retirarMeta, eliminarMeta } from '../services/metasService'
import { formatCOP } from '../utils/helpers'

export default function Goals({ onBack }) {
  const [metas, setMetas] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', montoObjetivo: '', fechaLimite: '' })
  const [montos, setMontos] = useState({})
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [aBorrar, setABorrar] = useState(null)

  const cargar = useCallback(async () => {
    try { setMetas((await listarMetas()) || []) } catch (e) { setError(e.message) } finally { setCargando(false) }
  }, [])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos; el setState ocurre tras el await
  useEffect(() => { cargar() }, [cargar])

  async function crear(e) {
    e.preventDefault(); setError('')
    try {
      await crearMeta({ nombre: form.nombre.trim(), descripcion: form.descripcion || null,
        montoObjetivo: Number(form.montoObjetivo), fechaLimite: form.fechaLimite || null })
      setForm({ nombre: '', descripcion: '', montoObjetivo: '', fechaLimite: '' }); cargar()
    } catch (err) { setError(err.message) }
  }

  async function mover(meta, fn) {
    const m = Number(montos[meta.idMeta])
    if (!(m > 0)) { setError('Escribe un monto mayor a cero.'); return }
    setError('')
    try { await fn(meta.idMeta, m); setMontos({ ...montos, [meta.idMeta]: '' }); cargar() }
    catch (err) { setError(err.message) }
  }

  async function borrar() {
    try { await eliminarMeta(aBorrar.idMeta); setABorrar(null); cargar() }
    catch (err) { setError(err.message); setABorrar(null) }
  }

  return (
    <PageShell etiqueta="AHORRO" titulo="Metas de ahorro" onBack={onBack}>
      <form className="panel grid-form" onSubmit={crear}>
        <div className="input-group"><label>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></div>
        <div className="input-group"><label>Descripción</label>
          <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
        <div className="input-group"><label>Objetivo (COP)</label>
          <input type="number" min="1" value={form.montoObjetivo} onChange={(e) => setForm({ ...form, montoObjetivo: e.target.value })} required /></div>
        <div className="input-group"><label>Fecha límite</label>
          <input type="date" value={form.fechaLimite} onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })} /></div>
        <button className="small-button">Crear meta</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {cargando && <p className="muted">Cargando...</p>}
      {!cargando && !metas.length && <p className="muted">Aún no tienes metas.</p>}

      <div className="list">
        {metas.map((m) => {
          const pct = Number(m.porcentajeProgreso) || 0
          const completa = m.estado === 'COMPLETADA'
          return (
            <div className="panel" key={m.idMeta}>
              <div className="row-item" style={{ padding: 0, background: 'none' }}>
                <strong>{m.nombre} {completa && <span className="badge">✓ Completada</span>}</strong>
                <span>{formatCOP(m.montoActual)} de {formatCOP(m.montoObjetivo)} ({pct.toFixed(0)}%)</span>
              </div>
              {m.descripcion && <p className="muted">{m.descripcion}</p>}
              <div className={`progress ${completa ? 'nivel-verde' : ''}`}><span style={{ width: `${Math.min(pct, 100)}%`, background: completa ? undefined : 'var(--blue)' }} /></div>
              {m.fechaLimite && <p className="muted">Fecha límite: {m.fechaLimite}</p>}
              <div className="row-item" style={{ padding: 0, background: 'none' }}>
                <input style={{ maxWidth: 160 }} type="number" min="1" placeholder="Monto" value={montos[m.idMeta] || ''}
                  onChange={(e) => setMontos({ ...montos, [m.idMeta]: e.target.value })} />
                <div className="row-actions">
                  <button className="small-button" onClick={() => mover(m, abonarMeta)}>Abonar</button>
                  <button className="ghost-button" onClick={() => mover(m, retirarMeta)}>Retirar</button>
                  <button className="danger-button" onClick={() => setABorrar(m)}>Eliminar</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {aBorrar && <ConfirmDialog onCancel={() => setABorrar(null)} onConfirm={borrar}
        mensaje={`¿Eliminar la meta "${aBorrar.nombre}"? Esta acción no se puede deshacer.`} />}
    </PageShell>
  )
}
