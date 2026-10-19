import { useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { registrarTransaccion } from '../services/transaccionesService'
import { escanearFacturaEnMemoria } from '../services/ocrService'
import { useCategorias } from '../hooks/useCategorias'
import { getUserIdFromToken, formatCOP } from '../utils/helpers'
import Logo from '../components/Logo'
import './Transaction.css'

function Transaction({ onBack, onSaved }) {

  const { token } = useAuth()
  const { porId } = useCategorias()
  const [resultado, setResultado] = useState(null)

  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [comercio, setComercio] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('gasto')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [escaneando, setEscaneando] = useState(false)
  const [registroAutomatico, setRegistroAutomatico] = useState(true)
  const [infoOcr, setInfoOcr] = useState(null)

  const inputCamaraRef = useRef(null)
  const inputArchivoRef = useRef(null)

  async function guardarMovimiento({ montoVal, fechaVal, comercioVal, tipoVal }) {
    const idUsuario = getUserIdFromToken(token)
    if (!idUsuario) {
      throw new Error('No fue posible identificar al usuario de la sesión.')
    }

    const creada = await registrarTransaccion(token, {
      idUsuario,
      monto: Number(montoVal),
      fecha: fechaVal,
      comercio: comercioVal,
      tipoMovimiento: tipoVal,
    })

    setResultado(creada)
    setSuccess('Movimiento registrado correctamente.')
    setMonto('')
    setComercio('')
    return creada
  }

  async function handleArchivoFactura(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError('')
    setSuccess('')
    setInfoOcr(null)
    setEscaneando(true)

    try {
      const datos = await escanearFacturaEnMemoria(file)
      const nuevoComercio = datos.comercio || 'Comercio Factura'
      const nuevoMonto = datos.monto && Number(datos.monto) > 0 ? String(datos.monto) : ''
      const nuevaFecha = datos.fecha || new Date().toISOString().split('T')[0]
      const nuevoTipo = datos.tipo_movimiento || 'gasto'

      setComercio(nuevoComercio)
      if (nuevoMonto) setMonto(nuevoMonto)
      setFecha(nuevaFecha)
      setTipoMovimiento(nuevoTipo)
      setInfoOcr(datos)

      if (registroAutomatico && Number(datos.monto) > 0) {
        setLoading(true)
        await guardarMovimiento({
          montoVal: datos.monto,
          fechaVal: nuevaFecha,
          comercioVal: nuevoComercio,
          tipoVal: nuevoTipo,
        })
        setSuccess(
          `Factura de "${nuevoComercio}" por ${formatCOP(datos.monto)} escaneada y registrada automáticamente (imagen descartada de memoria).`
        )
      } else if (!Number(datos.monto)) {
        setError(
          'Detectamos el comercio de la factura, pero el total no fue legible con claridad. Ingresa el monto manualmente y presiona Guardar.'
        )
      }
    } catch (err) {
      setError(err.message || 'No fue posible procesar la imagen de la factura.')
    } finally {
      setEscaneando(false)
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await guardarMovimiento({
        montoVal: monto,
        fechaVal: fecha,
        comercioVal: comercio,
        tipoVal: tipoMovimiento,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="transaction-page">

      <header className="dashboard-header">

        <Logo />

        <button
          className="back-button dashboard-back"
          onClick={onBack}
        >
          ← Dashboard
        </button>

      </header>

      <section className="transaction-wrapper">

        <div className="transaction-intro">

          <span className="section-label">
            MOVIMIENTOS E IA
          </span>

          <h1>
            Nueva
            <span> transacción.</span>
          </h1>

          <p>
            Escanea una factura con tu cámara o registra el movimiento manualmente.
            SmartCash extrae únicamente los datos y descarta la foto al instante para no ocupar espacio.
          </p>

          <div className="transaction-decoration">
            <span>📸</span>
            <span>$</span>
            <span>🔥</span>
          </div>

        </div>

        <div className="transaction-card">

          <div className="transaction-card-header">

            <div className="mini-icon">
              $
            </div>

            <div>
              <h2>Registrar movimiento</h2>
              <p>Escanea tu recibo o completa la información.</p>
            </div>

          </div>

          <div className="ocr-scanner-box">
            <div className="ocr-header-row">
              <div className="ocr-title-group">
                <span>📸</span>
                <strong>Escáner Inteligente de Facturas</strong>
              </div>
              <span className="zero-storage-badge">Zero-Storage (Sin guardar fotos)</span>
            </div>

            <p className="ocr-desc">
              Toma una foto o sube la imagen de tu tirilla o factura. Extraemos comercio, fecha y total en memoria RAM sin almacenar la imagen.
            </p>

            <input
              ref={inputCamaraRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleArchivoFactura}
            />

            <input
              ref={inputArchivoRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleArchivoFactura}
            />

            <div className="ocr-actions-row">
              <button
                type="button"
                className="ocr-btn"
                disabled={escaneando || loading}
                onClick={() => inputCamaraRef.current?.click()}
              >
                {escaneando ? '⏳ Analizando factura...' : '📷 Tomar foto'}
              </button>

              <button
                type="button"
                className="ocr-btn"
                disabled={escaneando || loading}
                onClick={() => inputArchivoRef.current?.click()}
              >
                {escaneando ? '⏳ Procesando en RAM...' : '🖼️ Subir imagen de factura'}
              </button>
            </div>

            <label className="ocr-auto-toggle">
              <input
                type="checkbox"
                checked={registroAutomatico}
                onChange={(e) => setRegistroAutomatico(e.target.checked)}
              />
              Registrar automáticamente al terminar de escanear la factura
            </label>

            {infoOcr && (
              <div className="ocr-result-banner">
                <strong>Datos extraídos de la factura (imagen eliminada):</strong>
                <div>
                  • Comercio: <strong>{infoOcr.comercio}</strong>
                  {infoOcr.nit ? ` (NIT: ${infoOcr.nit})` : ''}
                </div>
                <div>
                  • Monto detectado: <strong>{infoOcr.monto > 0 ? formatCOP(infoOcr.monto) : 'Pendiente por confirmar'}</strong>
                  {' '}| Fecha: <strong>{infoOcr.fecha}</strong>
                </div>
                <div>
                  • Pre-clasificación IA: <strong>{infoOcr.categoria_sugerida}</strong> ({Math.round((infoOcr.nivel_confianza || 0) * 100)}% confianza)
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>

            <div className="amount-field">

              <label>Monto</label>

              <div className="amount-input">

                <span>$</span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={monto}
                  onChange={(event) =>
                    setMonto(event.target.value)
                  }
                  placeholder="0.00"
                  required
                />

              </div>

            </div>

            <div className="form-row">

              <div className="input-group">

                <label>Fecha</label>

                <input
                  type="date"
                  value={fecha}
                  onChange={(event) =>
                    setFecha(event.target.value)
                  }
                  required
                />

              </div>

              <div className="input-group">

                <label>Tipo de movimiento</label>

                <select
                  value={tipoMovimiento}
                  onChange={(event) =>
                    setTipoMovimiento(event.target.value)
                  }
                >

                  <option value="gasto">
                    Gasto
                  </option>

                  <option value="ingreso">
                    Ingreso
                  </option>

                </select>

              </div>

            </div>

            <div className="input-group">

              <label>Comercio</label>

              <input
                value={comercio}
                onChange={(event) =>
                  setComercio(event.target.value)
                }
                placeholder="Ej. Rappi, D1, Éxito..."
                required
              />

            </div>

            <div className="automatic-category">

              <div className="automatic-icon">
                ✦
              </div>

              <div>
                <strong>Categorización automática</strong>

                <span>
                  SmartCash procesará el comercio automáticamente.
                </span>
              </div>

            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
                {resultado?.idCategoria && (
                  <div>
                    Categoría asignada por la IA: <strong>{porId[resultado.idCategoria]?.nombre || 'categoría no listada'}</strong>
                    {resultado.confianzaCategorizacion != null &&
                      ` (confianza ${(resultado.confianzaCategorizacion * 100).toFixed(0)}%)`}.
                    {' '}Si no es correcta, puedes corregirla en el Historial.
                  </div>
                )}
                <button type="button" className="ghost-button" onClick={() => onSaved?.()}>Volver al dashboard</button>
              </div>
            )}

            <button
              className="main-button full-button"
              disabled={loading || escaneando}
            >
              {loading
                ? 'Registrando...'
                : 'Guardar transacción'
              }

              {!loading && <span>✓</span>}
            </button>

          </form>

        </div>

      </section>

    </main>
  )
}

export default Transaction
