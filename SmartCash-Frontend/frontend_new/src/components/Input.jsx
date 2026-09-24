
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
