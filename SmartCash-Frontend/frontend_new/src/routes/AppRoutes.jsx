import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Dashboard from '../pages/Dashboard'
import Transaction from '../pages/Transaction'
import Transactions from '../pages/Transactions'
import Budgets from '../pages/Budgets'
import Goals from '../pages/Goals'

// El proyecto no usa react-router (no estaba instalado ni se pidió
// agregarlo). Esto centraliza la lógica de navegación por estado:
// qué pantalla se muestra según si hay sesión (token) o no,
// y si el usuario ingresó por un enlace de recuperación con token en la URL.
function AppRoutes() {
  const { token, logout } = useAuth()

  // Extraemos token de recuperación de la URL si el usuario pulsó el enlace del correo
  const [resetToken, setResetToken] = useState(() => {
    if (typeof window === 'undefined') return ''
    const params = new URLSearchParams(window.location.search)
    return params.get('token') || ''
  })

  const [screen, setScreen] = useState(() => {
    if (token) return 'dashboard'
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const hasToken = params.has('token')
      const path = window.location.pathname.toLowerCase()
      if (hasToken || path.includes('reset-password') || path.includes('restablecer-password')) {
        return 'reset-password'
      }
    }
    return 'home'
  })

  // Si el backend responde 401/403 (token vencido) se cierra la sesión.
  useEffect(() => {
    const alExpirar = () => { logout(); setScreen('login') }
    window.addEventListener('smartcash:sesion-expirada', alExpirar)
    return () => window.removeEventListener('smartcash:sesion-expirada', alExpirar)
  }, [logout])

  function goTo(screenName) {
    setScreen(screenName)
  }

  function handleLogout() {
    logout()
    setScreen('home')
  }

  function handleResetSuccess() {
    // Limpia el token de la barra de direcciones del navegador
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
    setResetToken('')
    setScreen('login')
  }

  if (!token) {
    return (
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
            onLoginSuccess={() => goTo('dashboard')}
            onForgotPassword={() => goTo('forgot-password')}
          />
        )}

        {screen === 'register' && (
          <Register
            onBack={() => goTo('home')}
            onRegistered={() => goTo('login')}
          />
        )}

        {screen === 'forgot-password' && (
          <ForgotPassword
            onBack={() => goTo('login')}
            onGoToLogin={() => goTo('login')}
          />
        )}

        {screen === 'reset-password' && (
          <ResetPassword
            token={resetToken}
            onBack={() => goTo('login')}
            onResetSuccess={handleResetSuccess}
            onRequestNewLink={() => goTo('forgot-password')}
          />
        )}
      </>
    )
  }

  return (
    <>
      {screen === 'dashboard' && (
        <Dashboard
          onTransaction={() => goTo('transaction')}
          onHistory={() => goTo('history')}
          onBudgets={() => goTo('budgets')}
          onGoals={() => goTo('goals')}
          onLogout={handleLogout}
        />
      )}

      {screen === 'transaction' && (
        <Transaction
          onBack={() => goTo('dashboard')}
          onSaved={() => goTo('dashboard')}
        />
      )}
      {screen === 'history' && <Transactions onBack={() => goTo('dashboard')} />}
      {screen === 'budgets' && <Budgets onBack={() => goTo('dashboard')} />}
      {screen === 'goals' && <Goals onBack={() => goTo('dashboard')} />}
    </>
  )
}

export default AppRoutes
