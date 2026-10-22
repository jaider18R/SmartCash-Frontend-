# SmartCash — Frontend

React 19 + Vite. Navegación por estado (`src/routes/AppRoutes.jsx`), sesión con JWT (`src/context/AuthContext.jsx`) y todas las llamadas HTTP por `src/services/http.js`.

## Cómo correrlo

```bash
cp .env.example .env   # destinos del proxy de desarrollo (puertos del backend)
npm install
npm run dev            # http://localhost:5173
npm run lint && npm test && npm run build
```

Con Docker (desde la carpeta que tiene `docker-compose.yml`): `docker compose up --build -d` y abrir http://localhost:5173.

## Estructura

```
src/
  assets/images/      fotos de fondo (monedas-colombia, alcancia-ahorro)
  components/         piezas reutilizables (Logo, PageShell, MoneyInput, Input, ConfirmDialog)
    mascot/           Chigüi: dibujo base, accesorios por pose y animaciones
  config/env.js       rutas base de la API
  context/            sesión
  hooks/              useCategorias
  layout/             AuthLayout (pantallas sin sesión)
  pages/              una pantalla por archivo (+ su CSS)
  routes/             navegación
  services/           llamadas al backend
  styles/             theme.css (colores), globals.css (base y formularios), shared.css (piezas comunes)
  utils/              helpers y pruebas
```

## Diseño

- **Colores:** solo se definen en `src/styles/theme.css` (paleta vino/carmesí/naranja/amarillo + menta/crema/ocre/café). El resto del CSS usa `var(--...)`.
- **Mascota:** `<Mascot pose="..." />`. Poses: `saludo`, `inversiones`, `escaner`, `historial`, `presupuestos`, `metas`, `analitica`, `seguridad`. Para una pose nueva se agrega un accesorio en `components/mascot/accesorios.jsx` y su animación en `Mascot.css`.
- **Fotos de fondo:** clases `photo photo-monedas` / `photo photo-alcancia` (ver `shared.css`). Las imágenes viven en `assets/images`.
- **Menús y calendarios:** siempre con fondo oscuro y letra clara (`globals.css`), sin depender del mouse.
