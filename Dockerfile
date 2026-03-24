# 1. Production Stage
FROM node:22-alpine
WORKDIR /app

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache openssl

# Set Node environment a production
ENV NODE_ENV=production

# Copiar configuración de dependencias
COPY package*.json ./

# Instalar TODAS las deps (incluyendo dev) para poder generar el cliente
RUN npm ci --include=dev

# Generar cliente Prisma desde reset-infra
RUN npx prisma generate --schema ./node_modules/reset-infra/prisma/schema.prisma

# Eliminar devDependencies
RUN npm prune --omit=dev

# Copiar los compilados (deben existir localmente antes de docker build)
COPY dist ./dist

# Eliminar cache de npm
RUN npm cache clean --force

# El puerto que expone NestJS
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start:prod"]