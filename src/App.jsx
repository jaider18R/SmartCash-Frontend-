import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [screen, setScreen] = useState('home')
  const [token, setToken] = useState(localStorage.getItem('smartcash_token'))
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('smartcash_user') || 'null')
  )

  useEffect(() => {
    if (token) {
      setScreen('dashboard')
    }
  }, [])

  function saveSession(newToken) {
    localStorage.setItem('smartcash_token', newToken)
    setToken(newToken)
  }

  function logout() {
    localStorage.removeItem('smartcash_token')
    localStorage.removeItem('smartcash_user')

    setToken(null)
    setUser(null)
    setScreen('home')
  }

  function goTo(screenName) {
    setScreen(screenName)
  }

  return (
    <div className="app">

      {!token ? (
        <>
          {screen === 'home' && (
            <Home
              onLogin={() => goTo('login')}
              onRegister={() => goTo('register')}
            />
          )}

          {screen === 'login' && (
            <Login
              onBack={() => goTo('home')}
              onLogin={(newToken) => {
                saveSession(newToken)
                setScreen('dashboard')
              }}
            />
          )}

          {screen === 'register' && (
            <Register
              onBack={() => goTo('home')}
              onRegistered={() => goTo('login')}
            />
          )}
        </>
      ) : (
        <>
          {screen === 'dashboard' && (
            <Dashboard
              user={user}
              token={token}
              onTransaction={() => goTo('transaction')}
              onLogout={logout}
            />
          )}

          {screen === 'transaction' && (
            <Transaction
              token={token}
              onBack={() => goTo('dashboard')}
              onSaved={() => goTo('dashboard')}
            />
          )}
        </>
      )}

    </div>
  )
}

/* =========================
   LOGO
========================= */

function Logo() {
  return (
    <div className="logo">

      <div className="logo-coin">
        <span>$</span>
      </div>

      <div className="logo-text">
        <strong>Smart</strong>
        <span>Cash</span>
      </div>

      <div className="logo-flame">

      </div>

    </div>
  )
}

/* =========================
   HOME
========================= */

function Home({ onLogin, onRegister }) {
  return (
    <main className="home">

      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <nav className="navbar">
        <Logo />

        <div className="nav-links">
          <button onClick={onLogin} className="nav-button">
            Iniciar sesión
          </button>

          <button onClick={onRegister} className="nav-button primary-small">
            Registrarse
          </button>
        </div>
      </nav>

      <section className="hero">

        <div className="hero-content">

          <div className="eyebrow">
            <span>●</span>
            FINANZAS PERSONALES, MÁS INTELIGENTES
          </div>

          <h1>
            Haz que tu dinero
            <span> trabaje contigo.</span>
          </h1>

          <p className="hero-description">
            SmartCash te ayuda a registrar y organizar tus movimientos
            financieros de una forma sencilla, visual y pensada para ti.
          </p>

          <div className="hero-buttons">

            <button
              className="main-button"
              onClick={onLogin}
            >
              Iniciar sesión
              <span>→</span>
            </button>

            <button
              className="secondary-button"
              onClick={onRegister}
            >
              Crear cuenta
            </button>

          </div>

          <div className="hero-info">
            <span>🇨🇴</span>
            Diseñado pensando en las finanzas colombianas
          </div>

        </div>

        <PiggyBank />

      </section>

    </main>
  )
}

/* =========================
   ALCANCÍA SVG
========================= */

function PiggyBank() {
  return (
    <div className="piggy-container">
      {/* Brillo detrás de la alcancía */}
      <div className="piggy-glow"></div>

      {/* Monedas flotantes */}
      <div className="coin coin-one">$</div>
      <div className="coin coin-two">$</div>
      <div className="coin coin-three">$</div>
      <div className="coin coin-four">$</div>

      {/* Anillos luminosos */}
      <div className="piggy-ring ring-one"></div>
      <div className="piggy-ring ring-two"></div>

      {/* Alcancía */}
      <div className="piggy">

        {/* Cuerpo */}
        <div className="piggy-body">

          {/* Brillo superior */}
          <div className="piggy-highlight"></div>

          {/* Oreja izquierda */}
          <div className="piggy-ear ear-left"></div>

          {/* Oreja derecha */}
          <div className="piggy-ear ear-right"></div>

          {/* Ojo izquierdo */}
          <div className="piggy-eye eye-left"></div>

          {/* Ojo derecho */}
          <div className="piggy-eye eye-right"></div>

          {/* Hocico */}
          <div className="piggy-snout">
            <div className="snout-hole hole-left"></div>
            <div className="snout-hole hole-right"></div>
          </div>

          {/* Sonrisa */}
          <div className="piggy-smile"></div>

          {/* Ranura para monedas */}
          <div className="piggy-slot"></div>

          {/* Cola */}
          <div className="piggy-tail"></div>

          {/* Patas */}
          <div className="piggy-leg leg-one"></div>
          <div className="piggy-leg leg-two"></div>
          <div className="piggy-leg leg-three"></div>
          <div className="piggy-leg leg-four"></div>
        </div>

        {/* Texto SmartCash */}
        <div className="piggy-label">
          <span>SMART</span>
          <strong>$</strong>
          <span>CASH</span>
        </div>
      </div>
    </div>
  );
}

/* =========================
   LOGIN
========================= */

function Login({ onBack, onLogin }) {

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {

      const response = await fetch('/api/auth/login', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          correo,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Correo o contraseña incorrectos')
      }

      localStorage.setItem('smartcash_user', JSON.stringify({
        correo
      }))

      onLogin(data.token)

    } catch (error) {

      setError(error.message)

    } finally {

      setLoading(false)

    }
  }

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle="Ingresa a SmartCash y continúa organizando tus finanzas."
      onBack={onBack}
    >

      <form onSubmit={handleSubmit}>

        <Input
          label="Correo electrónico"
          type="email"
          value={correo}
          onChange={setCorreo}
          placeholder="tu@correo.com"
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          className="main-button full-button"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
          {!loading && <span>→</span>}
        </button>

      </form>

    </AuthLayout>
  )
}

/* =========================
   REGISTER
========================= */

function Register({ onBack, onRegistered }) {

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {

      const response = await fetch('/api/auth/registro', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          nombre,
          correo,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'No fue posible crear la cuenta')
      }

      setSuccess('Cuenta creada correctamente. Ahora puedes iniciar sesión.')

      setTimeout(() => {
        onRegistered()
      }, 1200)

    } catch (error) {

      setError(error.message)

    } finally {

      setLoading(false)

    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a organizar tus movimientos financieros con SmartCash."
      onBack={onBack}
    >

      <form onSubmit={handleSubmit}>

        <Input
          label="Nombre"
          value={nombre}
          onChange={setNombre}
          placeholder="Tu nombre"
        />

        <Input
          label="Correo electrónico"
          type="email"
          value={correo}
          onChange={setCorreo}
          placeholder="tu@correo.com"
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Mínimo 8 caracteres"
        />

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
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          {!loading && <span>→</span>}
        </button>

      </form>

    </AuthLayout>
  )
}

/* =========================
   AUTH LAYOUT
========================= */

function AuthLayout({ title, subtitle, onBack, children }) {

  return (
    <main className="auth-page">

      <div className="auth-decoration decoration-one"></div>
      <div className="auth-decoration decoration-two"></div>

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Volver
      </button>

      <div className="auth-wrapper">

        <div className="auth-brand">
          <Logo />

          <div className="auth-message">
            <h1>
              Tu dinero.
              <br />
              <span>Más inteligente.</span>
            </h1>
          </div>
        </div>

        <div className="auth-card">

          <div className="auth-card-header">

            <div className="mini-icon">
              $
            </div>

            <h2>{title}</h2>

            <p>{subtitle}</p>

          </div>

          {children}

        </div>

      </div>

    </main>
  )
}

/* =========================
   INPUT
========================= */

function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder
}) {

  return (
    <div className="input-group">

      <label>{label}</label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />

    </div>
  )
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({
  user,
  token,
  onTransaction,
  onLogout
}) {

  const correo = user?.correo || 'Usuario'

  return (
    <main className="dashboard-page">

      <header className="dashboard-header">

        <Logo />

        <div className="dashboard-user">

          <div className="avatar">
            {correo.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <span>Sesión activa</span>
            <strong>{correo}</strong>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Salir
          </button>

        </div>

      </header>

      <section className="dashboard-content">

        <div className="welcome-card">

          <div>

            <span className="section-label">
              SMARTCASH
            </span>

            <h1>
              Tu espacio financiero
              <span> empieza aquí.</span>
            </h1>

            <p>
              Registra tus movimientos y deja que SmartCash
              organice automáticamente la información.
            </p>

            <button
              className="main-button"
              onClick={onTransaction}
            >
              Nueva transacción
              <span>+</span>
            </button>

          </div>

          <div className="dashboard-illustration">
            <div className="floating-coin big">$</div>
            <div className="floating-coin small">$</div>

            <div className="dashboard-circle">
              💰
            </div>
          </div>

        </div>

        <div className="dashboard-grid">

          <div className="info-card">

            <div className="info-icon blue">
              +
            </div>

            <div>
              <h3>Registrar movimiento</h3>
              <p>
                Añade un ingreso o gasto de manera rápida.
              </p>
            </div>

          </div>

          <div className="info-card">

            <div className="info-icon purple">
              ✦
            </div>

            <div>
              <h3>Categorización</h3>
              <p>
                El backend analiza automáticamente el comercio.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  )
}

/* =========================
   TRANSACTION
========================= */

function Transaction({
  token,
  onBack,
  onSaved
}) {

  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [comercio, setComercio] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('gasto')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function getUserIdFromToken(jwt) {

    try {

      const payload = jwt.split('.')[1]

      const decoded = JSON.parse(
        atob(
          payload
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      )

      return decoded.id_usuario

    } catch {

      return null

    }
  }

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

      const response = await fetch('/api/transacciones', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({
          idUsuario,
          monto: Number(monto),
          fecha,
          comercio,
          tipoMovimiento
        })

      })

      const data = await response.json()

      if (!response.ok) {

        throw new Error(
          data.error ||
          'No fue posible registrar la transacción'
        )

      }

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

export default App