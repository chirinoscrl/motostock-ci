# MotoStock CI

Sistema básico de inventario de repuestos de motos con integración continua.

Proyecto académico enfocado en demostrar prácticas de control de versiones,
contenerización, pruebas automatizadas y pipelines de CI con GitHub Actions.

## Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Backend:** NestJS 10 + TypeScript
- **Base de datos:** MongoDB 7 (Mongoose)
- **Contenedores:** Docker + Docker Compose
- **CI:** GitHub Actions

## Estructura

```text
motostock-ci/
├── backend/        API REST en NestJS
├── frontend/       SPA en React + Vite
├── docs/           Documentación técnica y evidencias
├── .github/        Workflows de CI
└── docker-compose.yml
```

## Requisitos

- Node.js 20 (ver `.nvmrc`)
- Docker y Docker Compose v2
- npm 10+
- [Task](https://taskfile.dev) (opcional, recomendado): `brew install go-task`

## Ejecución

### Opción A — Centralizada con Task (recomendado)

Todas las operaciones del proyecto están centralizadas en `Taskfile.yml`. Lista las
tareas disponibles con:

```bash
task            # o `task --list`
```

Las más usadas:

| Comando | Descripción |
|---|---|
| `task up` | Levanta **todo el stack** (frontend + backend + MongoDB) en contenedores |
| `task down` | Apaga el stack y limpia volúmenes |
| `task smoke` | Verifica que backend (`/health`) y frontend (`/`) respondan |
| `task e2e` | Flujo completo por la API: crear → leer → filtrar → editar → borrar |
| `task ci` | Reproduce el pipeline de CI en local (lint + test + build + stack + smoke) |
| `task logs` / `task ps` | Logs y estado de los contenedores |

También hay tareas por capa: `task backend:test`, `task frontend:build`,
`task backend:dev`, `task frontend:dev`, etc.

### Opción B — Todo con Docker Compose

```bash
docker compose up --build
```

Esto levanta MongoDB, el backend y el frontend. El backend espera al `healthcheck`
de Mongo antes de arrancar. Una vez listo:

```bash
curl http://localhost:3000/health    # → {"status":"ok","service":"motostock-api"}
# Frontend disponible en http://localhost:8080
```

Para apagar y limpiar volúmenes:

```bash
docker compose down -v
```

### Opción C — Backend local + Mongo en Docker

```bash
# Terminal 1: Mongo en contenedor
docker compose up mongo

# Terminal 2: Backend
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### Frontend en desarrollo

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

El frontend lee `VITE_API_URL` (por defecto `http://localhost:3000`).

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Validación técnica del servicio |
| POST | `/spare-parts` | Crear repuesto (calcula `status` automáticamente) |
| GET | `/spare-parts` | Listar repuestos. Filtros: `?status=` y `?search=` (nombre/marca/categoría) |
| GET | `/spare-parts/:id` | Obtener un repuesto |
| PATCH | `/spare-parts/:id` | Actualizar (recalcula `status` si cambia el `stock`) |
| DELETE | `/spare-parts/:id` | Eliminar un repuesto |

Ejemplo de creación:

```bash
curl -X POST http://localhost:3000/spare-parts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pastillas de freno",
    "brand": "Yamaha",
    "category": "Frenos",
    "reference": "FR-2024",
    "price": 45000,
    "stock": 8
  }'
```

## Pruebas

```bash
cd backend
npm test          # 21 tests unitarios + integración (mongodb-memory-server)
npm run test:cov  # con reporte de cobertura
```

O de forma centralizada: `task backend:test`.

## Lint

```bash
cd backend && npm run lint
cd frontend && npm run lint
```

## Regla de negocio

El campo `status` se calcula server-side a partir de `stock`:

| Stock | Estado |
|---|---|
| `0` | `agotado` |
| `1 – 5` | `bajo_stock` |
| `> 5` | `disponible` |

## Documentación adicional

- [Definición funcional y técnica](docs/definicion-funcional-tecnica.md)
- [Entrega 1 — Docker](docs/entrega-1-docker.md)
- [Entrega 2 — CI](docs/entrega-2-ci.md)
- [Entrega 3 — Plan](docs/entrega-3-plan.md)
- [Branch protection](docs/branch-protection.md)
- [Evidencias](docs/evidencias.md)

## Estado del proyecto

✅ **Fase 1** — MVP funcional, Docker, CI básico
✅ **Fase 2** — CRUD completo + tests robustos
✅ **Fase 3** — Frontend completo y dockerizado, stack integrado y CI full-stack
