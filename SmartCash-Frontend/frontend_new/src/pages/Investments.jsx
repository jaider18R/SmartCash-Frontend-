import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import { formatCOP } from '../utils/helpers'
import { obtenerCatalogoInversiones, simularInversiones } from '../services/inversionesService'
import './Investments.css'

export default function Investments({ onBack }) {
  const [tab, setTab] = useState('simulador')
  const [monto, setMonto] = useState('1000000')
  const [plazo, setPlazo] = useState('12')
  const [catalogo, setCatalogo] = useState([])
  const [simulacion, setSimulacion] = useState(null)
  const [cargandoSimulacion, setCargandoSimulacion] = useState(false)
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarCatalogo() {
      try {
        const res = await obtenerCatalogoInversiones()
        if (res && res.opciones) {
          setCatalogo(res.opciones)
        }
      } catch (err) {
        console.error('Error al cargar catálogo de inversiones:', err)
      } finally {
        setCargandoCatalogo(false)
      }
    }
    cargarCatalogo()
  }, [])

  useEffect(() => {
    async function ejecutarSimulacion() {
      const val = Number(monto)
      if (!val || val <= 0) return
      setCargandoSimulacion(true)
      try {
        const res = await simularInversiones(val, Number(plazo))
        setSimulacion(res)
        setError('')
      } catch (err) {
        setError('No fue posible calcular la simulación.')
      } finally {
        setCargandoSimulacion(false)
      }
    }
    ejecutarSimulacion()
  }, [monto, plazo])

  return (
    <PageShell etiqueta="CRECIMIENTO FINANCIERO" titulo="Inversiones Inteligentes" onBack={onBack}>
      <div className="inversiones-container">
        
        <div className="intro-banner">
          <h2>Haz que tu dinero trabaje para ti en Colombia 🇨🇴</h2>
          <p>
            Conoce opciones de inversión 100% legales, reguladas por la Superintendencia Financiera de Colombia 
            o protegidas por el seguro Fogafín. Compara rendimientos, aprende sin tecnicismos y toma el control de tu futuro financiero.
          </p>
        </div>

        <div className="tabs-nav">
          <button 
            className={`tab-btn ${tab === 'simulador' ? 'active' : ''}`}
            onClick={() => setTab('simulador')}
          >
            📊 Simulador Multiactivo
          </button>
          <button 
            className={`tab-btn ${tab === 'catalogo' ? 'active' : ''}`}
            onClick={() => setTab('catalogo')}
          >
            📱 Plataformas y MPF Invest
          </button>
          <button 
            className={`tab-btn ${tab === 'guia' ? 'active' : ''}`}
            onClick={() => setTab('guia')}
          >
            💡 ¿Cómo empezar a invertir?
          </button>
        </div>

        {tab === 'simulador' && (
          <div className="simulator-card">
            <h3>Calcula tus rendimientos netos estimados</h3>
            <p className="muted" style={{ marginBottom: '1.5rem' }}>
              Proyectamos las ganancias con tasas reales del mercado colombiano y descontamos la retención en la fuente estimada.
            </p>

            <div className="sim-form-grid">
              <div className="input-group">
                <label>Monto a invertir (COP)</label>
                <input 
                  type="number" 
                  min="50000" 
                  step="50000" 
                  value={monto} 
                  onChange={(e) => setMonto(e.target.value)} 
                />
              </div>

              <div className="input-group">
                <label>Plazo de la inversión</label>
                <select value={plazo} onChange={(e) => setPlazo(e.target.value)}>
                  <option value="3">3 Meses (Corto plazo)</option>
                  <option value="6">6 Meses</option>
                  <option value="12">12 Meses (1 Año)</option>
                  <option value="24">24 Meses (2 Años)</option>
                  <option value="36">36 Meses (3 Años)</option>
                </select>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {simulacion && (
              <>
                <div className="alert-inflation">
                  <span>⚠️</span>
                  <div>
                    <strong>Cuidado con dejar el dinero quieto en efectivo:</strong> Con una inflación proyectada del {simulacion.inflacion_colombia_estimada_porcentaje}% E.A., tu capital de {formatCOP(simulacion.monto_invertido)} perdería un poder adquisitivo equivalente a <strong>{formatCOP(simulacion.perdida_poder_adquisitivo_efectivo)}</strong> en este periodo.
                  </div>
                </div>

                <div className="sim-stats-grid">
                  {simulacion.proyecciones.map((p, idx) => (
                    <div className="sim-item-card" key={idx}>
                      <div>
                        <div className="sim-item-header">
                          <div>
                            <div className="sim-item-title">{p.nombre_producto}</div>
                            <div className="sim-item-platform">{p.plataforma}</div>
                          </div>
                          <div className="sim-item-rate">~{p.tasa_ea_estimada}% <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>E.A.</span></div>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0.5rem 0' }}>
                          {p.descripcion_facil}
                        </p>

                        <div className="sim-item-values">
                          <div className="sim-value-row">
                            <span>Ganancia bruta:</span>
                            <span>+{formatCOP(p.rendimiento_bruto)}</span>
                          </div>
                          <div className="sim-value-row">
                            <span>Retención en fuente:</span>
                            <span>-{formatCOP(p.retencion_fuente_estimada)}</span>
                          </div>
                          <div className="sim-value-row highlight">
                            <span>Capital + Rendimiento:</span>
                            <span style={{ color: '#10b981' }}>{formatCOP(p.capital_final)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sim-badge-risk">
                        Riesgo: {p.riesgo}
                      </div>
                    </div>
                  ))}
                </div>

                {simulacion.recomendacion_perfil && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    💡 <strong>Consejo SmartCash:</strong> {simulacion.recomendacion_perfil}
                  </div>
                )}
              </>
            )}

            {cargandoSimulacion && <p className="muted" style={{ marginTop: '1rem' }}>Recalculando proyección...</p>}
          </div>
        )}

        {tab === 'catalogo' && (
          <div>
            <p className="muted" style={{ marginBottom: '1.5rem' }}>
              Plataformas fintech recomendadas para invertir desde Colombia. Cada plataforma cuenta con vigilancia oficial y convenios regulados.
            </p>

            {cargandoCatalogo && <p className="muted">Cargando directorio de plataformas...</p>}

            <div className="catalog-grid">
              {catalogo.map((item) => (
                <div 
                  className={`catalog-card ${item.id_opcion === 'mpf-invest' ? 'featured' : ''}`} 
                  key={item.id_opcion}
                >
                  <div>
                    {item.id_opcion === 'mpf-invest' && (
                      <span className="featured-tag">⭐ Destacado & Ecosistema Educativo</span>
                    )}
                    <h3 className="catalog-title">{item.titulo}</h3>
                    <div className="catalog-subtitle">{item.subtitulo}</div>
                    
                    <p className="catalog-desc">{item.que_es_facil}</p>

                    <div className="catalog-details">
                      <div className="catalog-detail-item">
                        <span className="catalog-detail-label">Rendimiento ref:</span>
                        <span className="catalog-detail-val" style={{ color: '#10b981' }}>{item.rentabilidad_estimada}</span>
                      </div>
                      <div className="catalog-detail-item">
                        <span className="catalog-detail-label">Monto mínimo:</span>
                        <span className="catalog-detail-val">{item.monto_minimo}</span>
                      </div>
                      <div className="catalog-detail-item">
                        <span className="catalog-detail-label">Disponibilidad:</span>
                        <span className="catalog-detail-val">{item.disponibilidad_liquidez}</span>
                      </div>
                      <div className="catalog-detail-item">
                        <span className="catalog-detail-label">Regulación:</span>
                        <span className="catalog-detail-val">{item.vigilancia}</span>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={item.url_promocional} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="catalog-action-btn"
                  >
                    Conocer {item.titulo} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'guia' && (
          <div className="educational-guide">
            <div className="guide-step-card">
              <div className="guide-step-num">1</div>
              <div className="guide-step-content">
                <h3>Crea tu fondo de emergencia primero</h3>
                <p>
                  Antes de invertir a largo plazo o en opciones con riesgo, guarda entre 1 y 3 meses de tus gastos fijos en una 
                  <strong> Cuenta de Alto Rendimiento</strong> (como Nu o Lulo). Así ganas intereses diarios mientras tu dinero sigue disponible para emergencias.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="guide-step-num">2</div>
              <div className="guide-step-content">
                <h3>Vence a la inflación con instrumentos de renta fija</h3>
                <p>
                  Si tienes dinero para metas a 6 meses o 1 año (vacaciones, compras programadas), un 
                  <strong> CDT Digital</strong> te garantiza el retorno exacto desde el primer día, respaldado por el seguro Fogafín hasta por $50 millones.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="guide-step-num">3</div>
              <div className="guide-step-content">
                <h3>Diversifica en fondos y proyectos con MPF Invest y Tyba</h3>
                <p>
                  A través de plataformas como <strong>MPF Invest</strong> puedes acceder a Fondos de Inversión Colectiva (FICs) gestionados por comisionistas de bolsa 
                  y proyectos colaborativos de crowdfunding, lo que te permite rentabilizar tu dinero sin necesidad de ser un experto bursátil.
                </p>
              </div>
            </div>

            <div className="guide-step-card">
              <div className="guide-step-num">4</div>
              <div className="guide-step-content">
                <h3>Invierte en renta variable solo con visión a largo plazo</h3>
                <p>
                  Comprar acciones colombianas o extranjeras a través de <strong>Trii</strong> ofrece los retornos potenciales más altos, 
                  pero también tiene fluctuaciones naturales del mercado. No inviertas dinero que vayas a necesitar en el corto plazo.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageShell>
  )
}
