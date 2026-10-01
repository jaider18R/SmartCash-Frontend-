// Input genérico reutilizado por Login y Register.
// No tiene un Input.css propio: su clase ".input-group" se estiliza en
// styles/shared.css porque esa misma clase también la usa Transaction.jsx
// directamente en sus campos de fecha y tipo de movimiento.
function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
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

export default Input
