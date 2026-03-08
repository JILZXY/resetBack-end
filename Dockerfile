# 1. Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para Prisma y node-gyp si es necesario
RUN apk add --no-cache openssl

# Copiar configuración de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para poder hacer build)
RUN npm ci

# Copiar el código fuente
COPY . .

# Generar el cliente de Prisma basado en el schema local (que ya trajiste de reset-infra)
RUN npx prisma generate

# Hacer el build de la aplicación NestJS
RUN npm run build

# 2. Production Stage
FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

# Set Node environment a production
ENV NODE_ENV=production

# Copiar package.json
COPY package*.json ./

# Instalar SOLO las dependencias de producción para optimizar la imagen
RUN npm ci --omit=dev

# Copiar el cliente de prisma generado en el stage anterior
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar los compilados
COPY --from=builder /app/dist ./dist

# Eliminar cache de npm
RUN npm cache clean --force

# El puerto que expone NestJS
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start:prod"]
