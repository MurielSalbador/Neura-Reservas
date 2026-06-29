# TuReserva

Plataforma de reservas online que permite a clientes descubrir y reservar servicios de distintos rubros (canchas deportivas, peluquerías, salones de eventos, gimnasios, médicos, restaurantes, etc.), y a los dueños de negocios gestionar sus turnos y recursos desde un panel centralizado.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript 5 |
| Base de datos | PostgreSQL |
| ORM | Prisma 5 |
| Estilos | Tailwind CSS 3 |
| Íconos | Lucide React |

---

## Modelo de datos

```
User       → rol: client | owner | admin
Category   → slug, ícono, color (10 categorías pre-cargadas)
Business   → pertenece a una Category, tiene un owner (User)
Resource   → servicio/recurso dentro de un Business (ej: "Cancha 1", "Peluquero Juan")
Booking    → reserva de un Resource, vinculada opcionalmente a un User
```

**Modos de reserva** (`bookingMode` en Business):
- `hourly` — por hora (canchas, estudios)
- `appointment` — turno con horario fijo (peluquerías, médicos)
- `daily` — día completo (salones de eventos)
- `range` — rango de días

**Estados de pago** en Booking: `pending` → `partial` (seña) → `paid`

**Estados de reserva**: `pending` → `confirmed` → `deposited` → `paid` → `completed` / `cancelled`

---

## Estructura del proyecto

```
/app
  /api
    /auth           → login, registro
    /bookings       → CRUD de reservas + control de conflictos
    /businesses     → CRUD de negocios con filtros y búsqueda
    /categories     → listado con conteo de negocios
    /availability   → franjas horarias disponibles por recurso y fecha
    /settings       → configuración global (restricción de mes en calendario)
    /users          → listado de usuarios con actividad
  /admin
    /reservas       → panel de gestión de reservas (owner/admin)
    /nueva-reserva  → ABM de negocios
  /explorar         → búsqueda y filtrado de negocios
  /negocio/[slug]   → perfil detallado de negocio + panel de reserva
  /mis-reservas     → reservas del cliente logueado
  /login
  /registro
  /context          → AuthContext (estado global del usuario)

/components
  /booking          → BookingPanel (formulario de reserva en 3 pasos)
  /layout           → LayoutShell, Sidebar, TopNav, AdminGuard

/lib
  prisma.ts         → cliente Prisma singleton
  auth.ts           → hash SHA256 de contraseñas
  utils.ts          → helpers de formato

/prisma
  schema.prisma     → definición del esquema
  seed.ts           → datos de ejemplo
```

---

## Flujos principales

### Cliente reservando un turno

1. Ingresa al home `/` y ve negocios destacados y categorías.
2. Va a `/explorar` y filtra por categoría, texto o ciudad.
3. Entra al perfil del negocio `/negocio/[slug]`.
4. En el **BookingPanel** (panel lateral derecho):
   - **Paso 1:** elige recurso, fecha y horario. El sistema consulta `/api/availability` y bloquea los turnos ya ocupados.
   - **Paso 2:** ingresa nombre, email, teléfono y notas opcionales (si está logueado, los datos se pre-completan).
   - **Paso 3:** confirmación con número de reserva.
5. La reserva se guarda con `status: pending` y `paymentStatus: pending`.
6. Desde `/mis-reservas` puede ver el estado y cancelar reservas futuras.

### Dueño / Administrador gestionando reservas

1. Inicia sesión con rol `owner` o `admin`.
2. Accede al panel `/admin/reservas`.
3. Ve la tabla de reservas filtrable por negocio, estado y fecha.
4. Puede editar inline: datos del cliente, estado de la reserva y estado de pago.
5. Desde `/admin/nueva-reserva` puede crear, editar y desactivar negocios.

---

## Autenticación y roles

La sesión se guarda en `localStorage` (`auth_user`). Las contraseñas se hashean con SHA256 + salt fijo.

| Rol | Acceso |
|---|---|
| `client` | Rol por defecto al registrarse. Puede reservar y ver sus reservas. |
| `owner` | Puede gestionar reservas y negocios desde el panel `/admin`. |
| `admin` | Acceso completo a la plataforma. |

El componente `AdminGuard` redirige al login a cualquier usuario sin rol `owner` o `admin`.

---

## Instalación y puesta en marcha

### Requisitos

- Node.js 18+
- PostgreSQL

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env y completar DATABASE_URL con tu conexión PostgreSQL

# 3. Sincronizar el esquema con la base de datos
npm run db:push

# 4. Cargar datos de ejemplo
npm run db:seed

# 5. Iniciar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:3000`.

### Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción (incluye prisma generate)
npm run start        # Servir build de producción
npm run db:push      # Sincronizar schema con la base de datos
npm run db:seed      # Poblar la base con datos de ejemplo
npm run db:studio    # Abrir Prisma Studio (GUI para la base de datos)
```

---

## Datos de ejemplo

El seed crea:

| Tipo | Detalle |
|---|---|
| Usuarios | `admin@reservas.com` / `admin123`, un owner y un cliente |
| Categorías | 10 (Canchas, Salones, Peluquerías, Gimnasios, Médicos, Restaurantes, etc.) |
| Negocios | 8 negocios con sus recursos y precios |
| Reservas | 5 reservas con distintos estados y pagos |

---

## Consideraciones para producción

- Reemplazar la autenticación por JWT o sesiones seguras (el sistema actual usa localStorage sin expiración).
- Integrar un procesador de pagos real (MercadoPago, Stripe, etc.).
- Agregar envío de notificaciones por email/SMS al confirmar o cancelar reservas.
- Implementar el sistema de reseñas (la estructura en la DB está lista, falta la UI).
- Configurar migraciones de Prisma (`prisma migrate`) en lugar de `db push` para entornos productivos.
