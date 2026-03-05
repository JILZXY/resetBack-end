# 1. Production Stage
FROM node:22-alpine

WORKDIR /app

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl

# Set Node environment a production
ENV NODE_ENV=production

# Copiar configuración de dependencias y cliente de Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias de producción
# Nota: Instalamos devDeps temporalmente para generar el cliente si es necesario, 
# o asumimos que el usuario lo genera localmente.
RUN npm ci --include=dev && npx prisma generate && npm prune --omit=dev

# Copiar los compilados (DEBEN EXISTIR LOCALMENTE antes de hacer docker build)
COPY dist ./dist

# Eliminar cache de npm
RUN npm cache clean --force

# El puerto que expone NestJS
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start:prod"]
