# Evidencias de ejecución

Este documento recopila la salida real de las validaciones de cada fase.
Cuando se hagan capturas de pantalla, pegarlas en este mismo archivo.

---

## Fase 1 — Validación local (2026-05-26)

### Tests del backend

```text
> motostock-backend@0.1.0 test
> jest

PASS src/spare-parts/calculate-status.spec.ts
PASS src/health/health.controller.spec.ts
PASS src/spare-parts/spare-parts.controller.spec.ts

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        2.121 s
```

### Build del frontend

```text
> motostock-frontend@0.1.0 build
> tsc -b && vite build

vite v5.4.21 building for production...
✓ 34 modules transformed.
dist/index.html                  0.32 kB │ gzip:  0.24 kB
dist/assets/index-Bz3DhoEn.js  147.58 kB │ gzip: 47.58 kB
✓ built in 305ms
```

### Lint

```text
> motostock-backend@0.1.0 lint
> eslint "src/**/*.ts"
(sin errores)

> motostock-frontend@0.1.0 lint
> eslint "src/**/*.{ts,tsx}"
(sin errores)
```

### Docker Compose

```text
✔ Image integracion_continua-backend Built
✔ Network integracion_continua_motostock-net Created
✔ Volume integracion_continua_mongo-data Created
✔ Container motostock-mongo Healthy
✔ Container motostock-backend Started
```

### Smoke test de endpoints

#### `GET /health`

```bash
$ curl http://localhost:3000/health
{"status":"ok","service":"motostock-api"}
```

#### `POST /spare-parts` (stock = 8 → `disponible`)

```bash
$ curl -X POST http://localhost:3000/spare-parts \
    -H "Content-Type: application/json" \
    -d '{"name":"Pastillas de freno","brand":"Yamaha","category":"Frenos","reference":"FR-2024","price":45000,"stock":8}'
```

```json
{
  "name": "Pastillas de freno",
  "brand": "Yamaha",
  "category": "Frenos",
  "reference": "FR-2024",
  "price": 45000,
  "stock": 8,
  "status": "disponible",
  "_id": "6a15b6712ba325b5f5a29f77",
  "createdAt": "2026-05-26T15:04:17.658Z",
  "updatedAt": "2026-05-26T15:04:17.658Z"
}
```

#### `POST /spare-parts` (stock = 3 → `bajo_stock`)

```json
{ "stock": 3, "status": "bajo_stock", ... }
```

#### `POST /spare-parts` (stock = 0 → `agotado`)

```json
{ "stock": 0, "status": "agotado", ... }
```

#### `POST /spare-parts` (price = -1 → 400)

```text
HTTP 400 Bad Request
```

#### `GET /spare-parts`

Devuelve los 3 repuestos creados, ordenados por `createdAt` descendente.

---

## Fase 2 — (pendiente)

## Fase 3 — (pendiente)

## Fase 4 — (pendiente)

---

## Capturas de pantalla

> Una vez ejecutes el workflow en GitHub, pegar aquí:
>
> - Captura de la pestaña **Actions** con el run verde.
> - Captura de cada step expandido (lint, test, build, smoke).
> - Captura del badge de CI en el README renderizado.
> - URL del run público.
