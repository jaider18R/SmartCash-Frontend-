export default function ConfirmDialog({ mensaje, onConfirm, onCancel, cargando }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-box">
        <p>{mensaje}</p>
        <div className="modal-actions">
          <button className="ghost-button" onClick={onCancel} disabled={cargando}>Cancelar</button>
          <button className="danger-button" onClick={onConfirm} disabled={cargando}>
            {cargando ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}
