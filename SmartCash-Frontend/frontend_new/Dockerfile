# ==============================================================================
# Multi-stage Dockerfile para Frontend React + Vite
# Buenas practicas aplicadas:
# - Multi-stage: Node build -> Nginx Alpine ligero (~25MB)
# - No herramientas de desarrollo en la imagen final
# ==============================================================================

# Etapa 1: Build de la aplicacion React
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json para cachear dependencias
COPY package*.json ./
RUN npm ci

# Copiar el codigo fuente y compilar
COPY . .
RUN npm run build

# Etapa 2: Servidor web ligero Nginx
FROM nginx:1.27-alpine AS runtime

LABEL maintainer="SmartCash Team"
LABEL version="1.0.0"
LABEL description="Frontend web SmartCash servido con Nginx"

# Copiar configuracion personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
