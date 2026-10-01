import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

// Antes este archivo tenía las 5 pantallas + toda la lógica de sesión
// (996 líneas en total). Ahora solo arma el "esqueleto": provee la sesión
// (AuthProvider) y deja que AppRoutes decida qué pantalla mostrar.
function App() {
  return (
    <div className="app">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  )
}

export default App
