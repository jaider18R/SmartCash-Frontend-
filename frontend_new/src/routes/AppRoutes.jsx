import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Transaction from '../pages/Transaction'

// El proyecto no usa react-router (no estaba instalado ni se pidió
// agregarlo). Esto centraliza exactamente la misma lógica de navegación
// por estado que antes estaba mezclada dentro de App.jsx: qué pantalla se
// muestra según si hay sesión (token) o no, y la función goTo() para
// cambiar de pantalla.
function AppRoutes() {
  const { token, logout } = useAuth()
  const [screen, setScreen] = useState('home')

  useEffect(() => {
    if (token) {
      setScreen('dashboard')
    }
  }, [])

  function goTo(screenName) {
    setScreen(screenName)
  }

  function handleLogout() {
    logout()
    setScreen('home')
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
          />
        )}

        {screen === 'register' && (
          <Register
            onBack={() => goTo('home')}
            onRegistered={() => goTo('login')}
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
          onLogout={handleLogout}
        />
      )}

      {screen === 'transaction' && (
        <Transaction
          onBack={() => goTo('dashboard')}
          onSaved={() => goTo('dashboard')}
        />
      )}
    </>
  )
}

export default AppRoutes
