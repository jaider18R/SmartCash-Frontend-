import { formatCOP } from './helpers'

export function exportarTransaccionesCSV(items, categoriasPorId) {
  if (!items || !items.length) {
    throw new Error('No hay transacciones para exportar.')
  }

  const encabezados = [
    'Fecha',
    'Tipo',
    'Comercio',
    'Categoría',
    'Monto (COP)',
    'Confianza IA (%)'
  ]

  const filas = items.map((t) => {
    const fecha = t.fecha || ''
    const tipo = (t.tipoMovimiento || '').toUpperCase()
    const comercio = `"${(t.comercio || '').replace(/"/g, '""')}"`
    const categoria = `"${(categoriasPorId[t.idCategoria]?.nombre || 'Sin categoría').replace(/"/g, '""')}"`
    const monto = Math.round(Number(t.monto) || 0)
    const confianza = t.confianzaCategorizacion != null 
      ? Math.round(t.confianzaCategorizacion * 100) 
      : 'N/A'

    return [fecha, tipo, comercio, categoria, monto, confianza].join(';')
  })

  const BOM = '\uFEFF'
  const contenidoCSV = BOM + [encabezados.join(';'), ...filas].join('\r\n')

  const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `smartcash_movimientos_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function imprimirReportePDF({ items, categoriasPorId, filtros, usuarioCorreo }) {
  if (!items || !items.length) {
    throw new Error('No hay transacciones para generar el reporte.')
  }

  let totalIngresos = 0
  let totalGastos = 0
  const desgloseCategorias = {}

  items.forEach((t) => {
    const m = Number(t.monto) || 0
    if (t.tipoMovimiento === 'ingreso') {
      totalIngresos += m
    } else {
      totalGastos += m
      const catNombre = categoriasPorId[t.idCategoria]?.nombre || 'Sin categoría'
      desgloseCategorias[catNombre] = (desgloseCategorias[catNombre] || 0) + m
    }
  })

  const balanceNeto = totalIngresos - totalGastos
  const fechaGeneracion = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const ventana = window.open('', '_blank')
  if (!ventana) {
    throw new Error('El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para generar el PDF.')
  }

  const filasHTML = items.map((t) => {
    const esGasto = t.tipoMovimiento === 'gasto'
    const catNombre = categoriasPorId[t.idCategoria]?.nombre || 'Sin categoría'
    return `
      <tr>
        <td>${t.fecha}</td>
        <td><strong>${t.comercio}</strong></td>
        <td><span class="badge ${esGasto ? 'badge-gasto' : 'badge-ingreso'}">${t.tipoMovimiento.toUpperCase()}</span></td>
        <td>${catNombre}</td>
        <td class="text-right ${esGasto ? 'valor-gasto' : 'valor-ingreso'}">
          ${esGasto ? '-' : '+'}${formatCOP(t.monto)}
        </td>
      </tr>
    `
  }).join('')

  const categoriasHTML = Object.entries(desgloseCategorias)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => `
      <div class="stat-box">
        <span class="stat-label">${cat}</span>
        <strong class="stat-value">${formatCOP(val)}</strong>
      </div>
    `).join('')

  const periodoTexto = (filtros?.desde || filtros?.hasta)
    ? `Período: ${filtros.desde || 'Inicio'} hasta ${filtros.hasta || 'Presente'}`
    : 'Período: Histórico consolidado'

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>SmartCash - Reporte Financiero</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 24px;
          background: #fff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #0284c7;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #0284c7;
        }
        .meta-info {
          text-align: right;
          font-size: 12px;
          color: #64748b;
        }
        .meta-info strong {
          color: #334155;
        }
        h1 {
          font-size: 20px;
          margin: 0 0 6px 0;
          color: #0f172a;
        }
        .periodo {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 20px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .summary-card {
          padding: 14px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }
        .summary-label {
          font-size: 12px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
        }
        .summary-val {
          font-size: 18px;
          font-weight: 800;
          display: block;
          margin-top: 4px;
        }
        .val-ingreso { color: #16a34a; }
        .val-gasto { color: #dc2626; }
        .val-balance { color: #0284c7; }
        
        .cat-section {
          margin-bottom: 24px;
        }
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .stat-box {
          background: #f1f5f9;
          padding: 10px 12px;
          border-radius: 6px;
        }
        .stat-label {
          display: block;
          font-size: 11px;
          color: #475569;
        }
        .stat-value {
          font-size: 14px;
          color: #0f172a;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 12px;
        }
        th, td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        th {
          background-color: #f8fafc;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 11px;
        }
        .text-right { text-align: right; }
        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
        }
        .badge-gasto { background: #fee2e2; color: #991b1b; }
        .badge-ingreso { background: #dcfce7; color: #166534; }
        .valor-gasto { color: #dc2626; font-weight: 600; }
        .valor-ingreso { color: #16a34a; font-weight: 600; }

        .footer {
          margin-top: 40px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          font-size: 11px;
          color: #94a3b8;
          text-align: center;
        }

        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">SmartCash 🇨🇴</div>
        <div class="meta-info">
          <div>Usuario: <strong>${usuarioCorreo || 'Usuario'}</strong></div>
          <div>Generado: ${fechaGeneracion}</div>
        </div>
      </div>

      <h1>Reporte Financiero y Control de Movimientos</h1>
      <div class="periodo">${periodoTexto}</div>

      <div class="summary-grid">
        <div class="summary-card">
          <span class="summary-label">Total Ingresos</span>
          <span class="summary-val val-ingreso">+${formatCOP(totalIngresos)}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">Total Gastos</span>
          <span class="summary-val val-gasto">-${formatCOP(totalGastos)}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">Balance Neto</span>
          <span class="summary-val ${balanceNeto >= 0 ? 'val-ingreso' : 'val-gasto'}">${formatCOP(balanceNeto)}</span>
        </div>
      </div>

      ${categoriasHTML ? `
        <div class="cat-section">
          <h2 style="font-size: 14px; color: #334155; margin: 0;">Gastos por Categoría</h2>
          <div class="cat-grid">
            ${categoriasHTML}
          </div>
        </div>
      ` : ''}

      <h2 style="font-size: 14px; color: #334155; margin: 20px 0 0 0;">Detalle de Transacciones (${items.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Comercio / Detalle</th>
            <th>Tipo</th>
            <th>Categoría</th>
            <th class="text-right">Monto (COP)</th>
          </tr>
        </thead>
        <tbody>
          ${filasHTML}
        </tbody>
      </table>

      <div class="footer">
        Documento generado automáticamente por SmartCash · Plataforma de Gestión Financiera Personal · Colombia
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `)

  ventana.document.close()
}
