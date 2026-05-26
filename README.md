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

## Ejecución

### Opción A — Todo con Docker (recomendado para validar end-to-end)

```bash
docker compose up --build
```

Esto levanta MongoDB y el backend. El backend espera al `healthcheck` de Mongo
antes de arrancar. Una vez listo:

```bash
curl http://localhost:3000/health
# → {"status":"ok","service":"motostock-api"}
```

Para apagar y limpiar volúmenes:

```bash
docker compose down -v
```

### Opción B — Backend local + Mongo en Docker

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

## Endpoints actuales (Fase 1)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/health` | Validación técnica del servicio |
| POST | `/spare-parts` | Crear repuesto (calcula `status` automáticamente) |
| GET | `/spare-parts` | Listar repuestos |

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
npm test          # tests unitarios + integración (mongodb-memory-server)
npm run test:cov  # con reporte de cobertura
```

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
- [Branch protection](docs/branch-protection.md)
- [Evidencias](docs/evidencias.md)

## Estado del proyecto

✅ **Fase 1** — MVP funcional, Docker, CI básico (en curso)
⬜ **Fase 2** — CRUD completo + tests robustos
⬜ **Fase 3** — Frontend completo y dockerizado
