# Eventos API

API REST para gestionar **eventos e inscripciones**. Los organizadores publican eventos (charlas, talleres, meetups) y los usuarios se inscriben obteniendo un ticket.

Proyecto de **Programación Backend II: Diseño y Arquitectura Backend** — Coderhouse.

> 🚧 **Proyecto en desarrollo.** Se construye semana a semana; cada semana vive en su propia rama (`semana-1`, `semana-2`, …) y se integra a `main` al final de la clase. La sección [Roadmap](#roadmap) muestra qué está hecho y qué falta.

---

## Temática

Plataforma de eventos con tres tipos de usuario:

- **Usuarios** que buscan eventos y se inscriben.
- **Organizadores** que crean y administran sus propios eventos.
- **Administradores** que gestionan usuarios y tienen control total del sistema.

El sistema aplica reglas de negocio propias del dominio: no se permiten inscripciones a eventos sin cupo, cancelados o con fecha pasada, y un organizador solo puede editar los eventos que creó.

---

## Tecnologías

- **Node.js** 22+ (ES Modules)
- **Express**: servidor HTTP, rutas y middlewares
- **MongoDB** + **Mongoose**: persistencia y modelos
- Test runner nativo de Node (`node:test`)

Próximamente: bcrypt, JWT, cookies, Passport y Nodemailer.

---

## Instalación

**Requisitos:** Node.js 22 o superior y una base MongoDB (Atlas o local).

```bash
git clone <url-del-repo>
cd eventos-api
npm install
cp .env.example .env    # en Windows: copy .env.example .env
```

Completar el `.env` (ver [Variables de entorno](#variables-de-entorno)) y levantar el servidor:

```bash
npm run dev
```

El servidor queda en `http://localhost:8080`. Para verificar que responde: `GET /api/health`.

---

## Variables de entorno

El archivo `.env` **no se sube al repositorio**. Usar `.env.example` como guía.

| Variable | Descripción | Requerida desde |
|---|---|---|
| `PORT` | Puerto del servidor (default `8080`) | Semana 1 |
| `MONGO_URL` | Connection string de MongoDB, incluyendo el nombre de la base | Semana 1 |
| `JWT_SECRET` | Clave para firmar los tokens JWT | Próximamente |
| `COOKIE_SECRET` | Clave para firmar cookies | Próximamente |
| `MAIL_USER` | Cuenta de correo para notificaciones | Próximamente |
| `MAIL_PASS` | Contraseña de aplicación de esa cuenta | Próximamente |

Ejemplo de `MONGO_URL`:

```
mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/eventos
```

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta `server.js` con recarga automática (`node --watch`) |
| `npm start` | Levanta `server.js` |
| `npm test` | Corre los tests (no requieren base de datos) |

---

## Estructura del proyecto

```
eventos-api/
├── server.js             # Punto de entrada: conecta MongoDB y levanta el servidor
├── .env.example          # Variables de entorno necesarias (sin valores)
├── package.json
└── src/
    ├── app.js            # Crea y configura la app de Express (middlewares y rutas) y la exporta
    ├── config/           # Variables de entorno y conexión a MongoDB
    ├── routes/           # Endpoints: conectan URL → controller
    ├── controllers/      # Reciben la request y devuelven la response
    ├── services/         # Lógica de negocio (con inyección de dependencias)
    ├── models/           # Schemas de Mongoose
    ├── middlewares/      # Procesos intermedios (logs, auth, roles)
    └── utils/            # Funciones reutilizables (manejo de errores)
```

`server.js` y `app.js` están separados a propósito: `app.js` solo configura Express, sin conectarse a la base ni escuchar un puerto. Así se puede importar la app en tests sin levantar el servidor. `server.js` es el único que conecta MongoDB y llama a `listen`.

Flujo de una petición:

```
Cliente → Ruta → Middleware → Controller → Service → Model → MongoDB → Respuesta
```

A medida que avance el curso se suman las capas `repositories/`, `dao/` y `dto/`.

---

## Roles

| Rol | Permisos |
|---|---|
| `user` | Ver eventos e inscribirse |
| `organizer` | Crear, editar y eliminar **sus** eventos |
| `admin` | Gestionar usuarios y todos los eventos |

> Los roles ya están definidos en el modelo de usuario. El control de permisos por rol se implementa en las próximas semanas.

---

## Endpoints

### Health

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| GET | `/api/health` | Verifica que el servidor responde | ✅ |

### Eventos

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| GET | `/api/events` | Lista todos los eventos | ✅ |
| GET | `/api/events/:id` | Detalle de un evento | ✅ |
| POST | `/api/events` | Crea un evento | ✅ |
| PUT | `/api/events/:id` | Actualiza un evento | ✅ |
| DELETE | `/api/events/:id` | Elimina un evento | ✅ |

### Usuarios

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| GET | `/api/users` | Lista usuarios (sin contraseña) | ✅ |
| POST | `/api/users` | Crea un usuario | ✅ |

### Tickets (inscripciones)

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| GET | `/api/tickets` | Lista inscripciones con datos del evento | ✅ |
| POST | `/api/tickets` | Crea una inscripción y notifica al usuario | ✅ |

### Sesiones

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| POST | `/api/sessions/login` | Inicia sesión | 🚧 Responde `501` |

---

## Ejemplos de uso

### Crear un usuario

`POST /api/users`

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@email.com",
  "password": "123456"
}
```

Respuesta `201` (la contraseña nunca se devuelve):

```json
{
  "status": "success",
  "payload": {
    "_id": "6650f0f0f0f0f0f0f0f0f0f1",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@email.com",
    "role": "user"
  }
}
```

### Crear un evento

`POST /api/events`

```json
{
  "title": "DevFest Buenos Aires",
  "description": "Charlas de desarrollo web",
  "date": "2026-12-10T18:00:00.000Z",
  "capacity": 100
}
```

### Inscribirse a un evento

`POST /api/tickets`

```json
{
  "eventId": "<_id del evento>",
  "userEmail": "ana@email.com"
}
```

Respuesta `201`. Además, en consola se registra la notificación simulada:

```
📧 [mail simulado] Para: ana@email.com → Tu reserva para el evento ... fue confirmada
```

### Formato de errores

Todos los errores responden con la misma forma:

```json
{
  "status": "error",
  "error": "Evento no encontrado"
}
```

| Código | Cuándo |
|---|---|
| `400` | Datos inválidos o id con formato incorrecto |
| `401` | Usuario no autenticado *(próximamente)* |
| `403` | Usuario sin permisos *(próximamente)* |
| `404` | Recurso o ruta inexistente |
| `409` | Conflicto (por ejemplo, email ya registrado) |
| `500` | Error interno del servidor |
| `501` | Funcionalidad todavía no implementada |

---

## Roadmap

- [x] **Semana 1:** estructura por capas, conexión a MongoDB, CRUD de eventos, usuarios sin exponer contraseña, manejo de errores con códigos HTTP y servicio de reservas con inyección de dependencias y tests.
- [ ] Hash de contraseñas con bcrypt
- [ ] Login con JWT y cookies
- [ ] Estrategias de Passport
- [ ] Middlewares de autenticación y autorización por rol
- [ ] Capas DAO, Repository y DTO
- [ ] Reglas de negocio de inscripción: cupo, eventos cancelados y fechas pasadas
- [ ] Notificaciones por mail reales con Nodemailer
- [ ] Recuperación de contraseña

---

## Autor

Lucas Madrigal — Programación Backend II, Coderhouse.