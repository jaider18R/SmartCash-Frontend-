import { useCallback, useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import MoneyInput from '../components/MoneyInput'
import { useCategorias } from '../hooks/useCategorias'
import { listarPresupuestos, guardarPresupuesto } from '../services/presupuestosService'
import { listarTransacciones } from '../services/transaccionesService'
import { formatCOP, nivelPresupuesto, gastoPorCategoria } from '../utils/helpers'

export default function Budgets({ onBack }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())
  const { categorias } = useCategorias()
  const [presupuestos, setPresupuestos] = useState([])
  const [gastos, setGastos] = useState({})
  const [idCategoria, setIdCategoria] = useState('')
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    try {
      const [p, t] = await Promise.all([listarPresupuestos(), listarTransacciones()])
      setPresupuestos(p || [])
      setGastos(gastoPorCategoria(t || [], mes, anio))
      setError('')
    } catch (e) { setError(e.message) } finally { setCargando(false) }
  }, [mes, anio])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos; el setState ocurre tras el await
  useEffect(() => { cargar() }, [cargar])

  async function guardar(e) {
    e.preventDefault(); setError(''); setOk('')
    const cat = categorias.find((c) => c.idCategoria === idCategoria)
    if (!cat || Number(monto) <= 0) { setError('Elige una categoría y un límite mayor a cero.'); return }
    try {
      await guardarPresupuesto({ idCategoria, nombreCategoria: cat.nombre, montoLimite: Number(monto), mes, anio })
      setOk('Presupuesto guardado.'); setMonto(''); cargar()
    } catch (err) { setError(err.message) }
  }

  const delMes = presupuestos.filter((p) => p.mes === mes && p.anio === anio)

  return (
    <PageShell
      etiqueta="Presupuestos"
      titulo="Presupuestos mensuales"
      descripcion="Define un límite por categoría y mira cuánto llevas gastado este mes."
      pose="presupuestos"
      imagen="monedas"
      onBack={onBack}
    >
      <form className="panel grid-form" onSubmit={guardar}>
        <div className="input-group"><label>Mes</label>
          <select value={mes} onChange={(e) => { setCargando(true); setMes(Number(e.target.value)) }}>
            {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{new Date(2000, i, 1).toLocaleString('es-CO', { month: 'long' })}</option>)}
          </select></div>
        <div className="input-group"><label>Año</label>
          <input type="number" min="2000" value={anio} onChange={(e) => { setCargando(true); setAnio(Number(e.target.value)) }} /></div>
        <div className="input-group"><label>Categoría</label>
          <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required>
            <option value="">Selecciona...</option>
            {categorias.map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
          </select></div>
        <div className="input-group"><label>Límite (COP)</label>
          <MoneyInput value={monto} onChange={setMonto} placeholder="Ej: 500.000" required /></div>
        <button className="small-button">Guardar presupuesto</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {ok && <div className="success-message">{ok}</div>}
      {cargando && <p className="muted">Cargando...</p>}
      {!cargando && (
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Vigencia del periodo: <strong>{new Date(anio, mes - 1, 1).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })}</strong> al <strong>{new Date(anio, mes, 0).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })}</strong>
        </div>
      )}
      {!cargando && !delMes.length && <p className="muted">No hay presupuestos para este mes.</p>}

      <div className="list">
        {delMes.map((p) => {
          const gastado = gastos[p.idCategoria] || 0
          const pct = (gastado / Number(p.montoLimite)) * 100
          const nivel = nivelPresupuesto(pct)
          const inicio = p.fechaInicio || new Date(p.anio, p.mes - 1, 1).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
          const fin = p.fechaFin || new Date(p.anio, p.mes, 0).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
          return (
            <div className="panel" key={p.idPresupuesto}>
              <div className="row-item plain">
                <div>
                  <strong>{p.nombreCategoria}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Periodo: {inicio} al {fin}
                  </div>
                </div>
                <span>{formatCOP(gastado)} de {formatCOP(p.montoLimite)} ({pct.toFixed(0)}%)</span>
              </div>
              <div className={`progress nivel-${nivel}`}><span style={{ width: `${Math.min(pct, 100)}%` }} /></div>
              <p className="muted">
                {nivel === 'rojo' ? 'Presupuesto superado.' : nivel === 'naranja' ? 'Estás cerca del límite.' : 'Dentro del presupuesto.'}
                {' '}El aviso por correo lo envía el servicio de notificaciones del backend.
              </p>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
