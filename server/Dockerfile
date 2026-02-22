# server/Dockerfile
FROM node:18-slim

# Instalar pnpm
RUN npm install -g pnpm

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto del código
COPY . .

# Instalar playwright
RUN pnpm playwright install chromium

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["pnpm", "start"]