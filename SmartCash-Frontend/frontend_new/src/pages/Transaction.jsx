import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { registrarTransaccion } from '../services/transaccionesService'
import { getUserIdFromToken } from '../utils/helpers'
import Logo from '../components/Logo'
import './Transaction.css'

// Antes recibía "token" como prop; ahora lo toma directamente del
// AuthContext con useAuth().
function Transaction({ onBack, onSaved }) {

  const { token } = useAuth()

  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [comercio, setComercio] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('gasto')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {

    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    const idUsuario = getUserIdFromToken(token)

    if (!idUsuario) {

      setError(
        'No fue posible identificar al usuario de la sesión.'
      )

      setLoading(false)

      return
    }

    try {
      await registrarTransaccion(token, {
        idUsuario,
        monto: Number(monto),
        fecha,
        comercio,
        tipoMovimiento,
      })

      setSuccess(
        `Movimiento registrado correctamente.`
      )

      setMonto('')
      setComercio('')

    } catch (error) {

      setError(error.message)

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
            MOVIMIENTOS
          </span>

          <h1>
            Nueva
            <span> transacción.</span>
          </h1>

          <p>
            Registra el movimiento y SmartCash se encargará
            de procesarlo y categorizarlo.
          </p>

          <div className="transaction-decoration">
            <span>$</span>
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
              <p>Completa la información del movimiento.</p>
            </div>

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
              </div>
            )}

            <button
              className="main-button full-button"
              disabled={loading}
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
