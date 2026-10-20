import { API } from '../config/env'
import { apiFetch } from './http'

export function comprimirImagenEnMemoria(file) {
  return new Promise((resolve, reject) => {
    if (file.size <= 4 * 1024 * 1024) {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('No fue posible leer la imagen seleccionada.'))
      reader.readAsDataURL(file)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      try {
        const maxAncho = 2000
        let { width, height } = img
        if (width > maxAncho) {
          height = Math.round((height * maxAncho) / width)
          width = maxAncho
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const base64 = canvas.toDataURL('image/jpeg', 0.92)
        canvas.width = 0
        canvas.height = 0
        URL.revokeObjectURL(objectUrl)
        resolve(base64)
      } catch (err) {
        URL.revokeObjectURL(objectUrl)
        reject(err)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('No fue posible leer la imagen seleccionada.'))
    }

    img.src = objectUrl
  })
}

export async function escanearFacturaEnMemoria(file) {
  const imagenBase64 = await comprimirImagenEnMemoria(file)
  return apiFetch(`${API.OCR}/factura`, {
    method: 'POST',
    body: {
      imagen_base64: imagenBase64,
      nombre_archivo: file.name || ''
    }
  })
}
