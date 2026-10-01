import './Logo.css'

// Se usa en Home, AuthLayout, Dashboard y Transaction — por eso es un
// componente reutilizable y no algo pegado a una sola página.
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

export default Logo
