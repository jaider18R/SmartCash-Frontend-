import { useCallback, useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import MoneyInput from '../components/MoneyInput'
import { useCategorias } from '../hooks/useCategorias'
import { resumenMensual, gastoSeguro, simularGasto } from '../services/analiticaService'
import { formatCOP } from '../utils/helpers'
import './Analytics.css'

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const NIVEL = { VERDE: 'verde', SALUDABLE: 'verde', AMARILLO: 'naranja', PRECAUCION: 'naranja', ROJO: 'rojo', CRITICO: 'rojo' }
function claseNivel(nivel) {
  return `nivel-${NIVEL[String(nivel || '').toUpperCase()] || 'naranja'}`
}

export default function Analytics({ onBack }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [resumen, setResumen] = useState(null)
  const [errorResumen, setErrorResumen] = useState('')
  const [cargando, setCargando] = useState(true)
  const { porId } = useCategorias()

  const [compromisos, setCompromisos] = useState('')
  const [ahorro, setAhorro] = useState('')
  const [seguro, setSeguro] = useState(null)
  const [errorSeguro, setErrorSeguro] = useState('')

  const [compra, setCompra] = useState('')
  const [sim, setSim] = useState(null)
  const [errorSim, setErrorSim] = useState('')

  const cargarResumen = useCallback(async () => {
    setCargando(true); setErrorResumen('')
    try { setResumen(await resumenMensual(mes, anio)) }
    catch (e) { setErrorResumen(e.message); setResumen(null) }
    finally { setCargando(false) }
  }, [mes, anio])
  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos; el setState ocurre tras el await
  useEffect(() => { cargarResumen() }, [cargarResumen])

  async function calcularSeguro(e) {
    e?.preventDefault(); setErrorSeguro(''); setSim(null)
    try { setSeguro(await gastoSeguro({ compromisosFijos: compromisos, ahorroMetas: ahorro })) }
    catch (err) { setErrorSeguro(err.message); setSeguro(null) }
  }

  async function simular(e) {
    e.preventDefault(); setErrorSim('')
    try { setSim(await simularGasto({ montoSimulado: compra, compromisosFijos: compromisos, ahorroMetas: ahorro })) }
    catch (err) { setErrorSim(err.message); setSim(null) }
  }

  function nombreCategoria(clave) {
    return porId[clave]?.nombre || (clave === 'Sin Categoria' ? 'Sin categoría' : 'Otra categoría')
  }

  const desglose = resumen ? Object.entries(resumen.desglose_categorias || {}).sort((a, b) => b[1] - a[1]) : []
  const maxGasto = desglose.length ? desglose[0][1] : 0

  return (
    <PageShell
      etiqueta="Analítica"
      titulo="Resumen y gasto seguro"
      descripcion="Entiende tu mes, calcula cuánto puedes gastar por día y simula una compra antes de hacerla."
      pose="analitica"
      imagen="monedas"
      onBack={onBack}
    >
      <section className="panel">
        <div className="an-filtro">
          <h3>Resumen financiero mensual</h3>
          <div className="an-selectores">
            <select value={mes} onChange={(e) => setMes(Number(e.target.value))} aria-label="Mes">
              {MESES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} aria-label="Año">
              {[0, 1, 2].map((d) => <option key={d} value={hoy.getFullYear() - d}>{hoy.getFullYear() - d}</option>)}
            </select>
          </div>
        </div>

        {errorResumen && <p className="error-message">{errorResumen}</p>}
        {cargando && <p className="muted">Cargando resumen…</p>}

        {resumen && !cargando && (
          <>
            <div className="an-tarjetas">
              <div className="an-tarjeta"><span className="muted">Ingresos</span><strong className="an-verde">{formatCOP(resumen.total_ingresos)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Gastos</span><strong className="an-rojo">{formatCOP(resumen.total_gastos)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Balance neto</span><strong className={resumen.balance_neto >= 0 ? 'an-verde' : 'an-rojo'}>{formatCOP(resumen.balance_neto)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Tasa de ahorro</span><strong>{resumen.tasa_ahorro_porcentaje}%</strong></div>
            </div>

            <h4>Gasto por categoría</h4>
            {desglose.length === 0 && <p className="muted">No hay gastos registrados en este mes.</p>}
            <ul className="an-barras">
              {desglose.map(([clave, valor]) => (
                <li key={clave}>
                  <div className="an-barra-top"><span>{nombreCategoria(clave)}</span><strong>{formatCOP(valor)}</strong></div>
                  <div className="progress nivel-naranja"><span style={{ width: `${maxGasto ? (valor / maxGasto) * 100 : 0}%` }} /></div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="panel">
        <h3>Gasto seguro diario</h3>
        <p className="muted">Cuánto puedes gastar por día hasta fin de mes sin tocar tus compromisos ni tus metas.</p>
        <form className="grid-form" onSubmit={calcularSeguro}>
          <div className="input-group"><label>Compromisos fijos del mes (arriendo, servicios…)</label>
            <MoneyInput value={compromisos} onChange={setCompromisos} placeholder="0" /></div>
          <div className="input-group"><label>Ahorro para metas este mes</label>
            <MoneyInput value={ahorro} onChange={setAhorro} placeholder="0" /></div>
          <div className="an-accion"><button className="main-button" type="submit">Calcular</button></div>
        </form>
        {errorSeguro && <p className="error-message">{errorSeguro}</p>}

        {seguro && (
          <div className="an-resultado">
            <div className="an-limite">
              <span className="muted">Puedes gastar hasta</span>
              <strong className={claseNivel(seguro.nivel_salud)}>{formatCOP(seguro.limite_diario_seguro)}</strong>
              <span className="muted">por día durante {seguro.dias_restantes_mes} días</span>
            </div>
            <div className="an-tarjetas">
              <div className="an-tarjeta"><span className="muted">Saldo disponible</span><strong>{formatCOP(seguro.saldo_disponible)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Compromisos fijos</span><strong>{formatCOP(seguro.compromisos_fijos)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Ahorro en metas</span><strong>{formatCOP(seguro.ahorro_metas)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Monto seguro restante</span><strong>{formatCOP(seguro.monto_seguro_restante)}</strong></div>
            </div>
            <p><span className={`badge ${claseNivel(seguro.nivel_salud)}`}>{seguro.nivel_salud}</span> {seguro.recomendacion}</p>
          </div>
        )}
      </section>

      <section className="panel">
        <h3>Simulador: ¿y si compro esto?</h3>
        <p className="muted">Mira cómo cambiaría tu límite diario antes de hacer la compra. Usa los compromisos y el ahorro de arriba.</p>
        <form className="grid-form" onSubmit={simular}>
          <div className="input-group"><label>Valor de la compra</label>
            <MoneyInput value={compra} onChange={setCompra} placeholder="Ej: 350.000" required /></div>
          <div className="an-accion"><button className="main-button" type="submit" disabled={!Number(compra)}>Simular</button></div>
        </form>
        {errorSim && <p className="error-message">{errorSim}</p>}

        {sim && (
          <div className="an-resultado">
            <p className={sim.es_viable ? 'an-verde an-veredicto' : 'an-rojo an-veredicto'}>
              {sim.es_viable ? 'La compra es viable' : 'La compra no es recomendable'}
            </p>
            <div className="an-tarjetas">
              <div className="an-tarjeta"><span className="muted">Compra simulada</span><strong>{formatCOP(sim.monto_simulado)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Nuevo límite diario</span><strong>{formatCOP(sim.nuevo_limite_diario)}</strong></div>
              <div className="an-tarjeta"><span className="muted">Baja por día</span><strong className="an-rojo">{formatCOP(sim.diferencia_diaria)}</strong></div>
            </div>
            <p>{sim.impacto_metas}</p>
          </div>
        )}
      </section>
    </PageShell>
  )
}
