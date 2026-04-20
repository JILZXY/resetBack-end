# Reset Backend API

[![NestJS](https://nestjs.com/img/logo-small.svg)](https://nestjs.com/)

---

## Resumen

**ReSet** es una aplicación web/móvil de automonitoreo y acompañamiento digital para personas post‑rehabilitadas de adicciones, enfocada en mantener la sobriedad y fortalecer la red de apoyo.

---

## Introducción

En México, el seguimiento post‑tratamiento de adicciones suele limitarse a consultas esporádicas, dejando a la persona vulnerable durante la reinserción a la vida cotidiana.

ReSet es una aplicación de automonitoreo y apoyo social que permite registrar consumo/no consumo, craving y estado emocional, así como gestionar rachas de sobriedad y una red de apoyo.

---

## Descripción

Este proyecto es una API **NestJS** que gestiona la bitácora de usuarios adictos, incluyendo módulos de patrocinio, seguimiento, foros, emergencias y rachas.

---

## Requisitos previos

- **Node.js** (v20 o superior)
- **npm** (v10 o superior) o **yarn**
- **Docker** (opcional, para ejecutar la base de datos y la API en contenedores)
- **PostgreSQL** (local o vía Docker)

> **Nota:** No se incluyen secretos ni variables de entorno en este documento. Usa el archivo `.env.example` como plantilla.

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JILZXY/resetBack-end.git
cd resetBack-end

# Instalar dependencias
npm install
```

---

## Configuración local

1. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```
2. Edita `.env` con tus credenciales (`DATABASE_URL`, `JWT_SECRET`, etc.).
3. (Opcional) Levanta la base de datos con Docker:
   ```bash
   docker compose up -d
   ```

---

## Ejecutar la API

```bash
# Modo desarrollo (recarga automática)
npm run start:dev

# Modo producción
npm run build && npm run start:prod
```

La API estará disponible en `http://localhost:3000`.

---

## Endpoints principales

### 1. Foro (`/forum`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/forum/posts` | Obtener lista de publicaciones.
| `POST` | `/forum/posts` | Crear una nueva publicación.
| `GET` | `/forum/posts/:id` | Obtener detalle de una publicación.
| `PUT` | `/forum/posts/:id` | Actualizar una publicación.
| `DELETE` | `/forum/posts/:id` | Eliminar una publicación.
| `POST` | `/forum/posts/:id/reactions` | Añadir reacción a una publicación.
| `POST` | `/forum/comments` | Crear comentario en una publicación.

### 2. Bitácora / Logs (`/tracking/logs`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/tracking/logs` | Registrar un nuevo log (consumo, craving, estado emocional, notas).
| `GET` | `/tracking/logs` | Obtener historial de logs con filtros.

#### Parámetros de consulta para `GET /tracking/logs`
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `year` | `number` | Año completo (ej. `2026`). |
| `month` | `number` | Mes (1‑12). Requiere `year`. |
| `day` | `number` | Día del mes (1‑31). Requiere `year` y `month`. |
| `from` | `string` (ISO) | Fecha de inicio para rango personalizado. |
| `to` | `string` (ISO) | Fecha de fin para rango personalizado. |

Ejemplos:
- `GET /tracking/logs?year=2026`
- `GET /tracking/logs?year=2026&month=4`
- `GET /tracking/logs?year=2026&month=4&day=15`
- `GET /tracking/logs?from=2026-01-01&to=2026-01-15`

Los resultados se devuelven ordenados de **más reciente a más antiguo**.

### 3. Emergencia (`/emergency`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/emergency/contacts` | Registrar un contacto de emergencia.
| `GET` | `/emergency/contacts` | Listar contactos de emergencia del usuario.
| `POST` | `/emergency/alert` | Enviar alerta de emergencia a los contactos registrados.

### 4. Tracking (`/tracking` – funcionalidades adicionales)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/tracking/statistics` | Obtener estadísticas agregadas (promedio de craving, estado emocional, racha actual, etc.). |
| `GET` | `/tracking/stats/moving-average` | Obtener promedio móvil de consumo/craving.
| `GET` | `/tracking/logs/latest` | Obtener el log más reciente.

### 5. Racha (`/streak`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/streak` | Obtener la racha actual del usuario.
| `GET` | `/streak/best` | Obtener las mejores rachas del usuario.
| `POST` | `/streak/reset` | Resetear la racha (usado por lógica interna).

---

## Docker

Puedes levantar la aplicación y la base de datos con Docker Compose:

```bash
docker compose up --build
```

---

## Tests

```bash
# Unit tests
npm run test

# End‑to‑end tests
npm run test:e2e
```

