# Entrega 1 — Contenerización con Docker

## Objetivo

Demostrar que el backend y MongoDB pueden ejecutarse como servicios independientes
en contenedores, comunicándose entre sí por nombre de servicio dentro de una red
de Docker Compose.

## Artefactos

| Archivo | Propósito |
|---|---|
| `backend/Dockerfile` | Imagen multi-stage del backend (builder + runtime alpine) |
| `backend/.dockerignore` | Excluye `node_modules`, `dist`, `.env`, etc. |
| `docker-compose.yml` | Orquesta `mongo` + `backend` en una red propia |

## Decisiones técnicas

1. **Multi-stage build**: el `builder` instala todas las deps y compila TypeScript;
   el `runtime` solo lleva `dist/` y deps de producción → imagen más pequeña.
2. **`HEALTHCHECK` en el backend**: cada 10s verifica `/health` con `node http`,
   sin curl (no incluido en `node:20-alpine`).
3. **Mongo con `healthcheck`**: usa `mongosh --eval "db.adminCommand('ping')"`
   para que el backend espere a que esté **realmente listo** (no solo arrancado).
4. **`depends_on: condition: service_healthy`**: garantiza orden de arranque.
5. **Red `motostock-net` propia**: el backend resuelve `mongo` por DNS interno.
6. **Volumen nombrado `mongo-data`**: persistencia entre `up`/`down` (sin `-v`).

## Variables de entorno

El backend lee `MONGO_URI` y `PORT` del entorno:

```env
MONGO_URI=mongodb://mongo:27017/motostock
PORT=3000
```

En Compose esto está definido directamente en el servicio. Para desarrollo local
usar `backend/.env` (basado en `.env.example`).

## Comandos de ejecución

```bash
# Levantar todo
docker compose up --build

# En segundo plano
docker compose up -d --build

# Ver logs
docker compose logs -f backend

# Tirar todo y limpiar volúmenes
docker compose down -v
```

## Evidencia de validación local

Ejecución del **2026-05-26**:

```text
✔ Network integracion_continua_motostock-net Created
✔ Volume integracion_continua_mongo-data Created
✔ Container motostock-mongo Healthy
✔ Container motostock-backend Started
```

Llamadas verificadas:

| Caso | Resultado |
|---|---|
| `GET /health` | `{"status":"ok","service":"motostock-api"}` (HTTP 200) |
| `POST` con stock=8 | `status: "disponible"` |
| `POST` con stock=3 | `status: "bajo_stock"` |
| `POST` con stock=0 | `status: "agotado"` |
| `POST` con price=-1 | HTTP 400 (validación) |
| `GET /spare-parts` | Lista los 3 ordenados por `createdAt` desc |

Ver `docs/evidencias.md` para capturas y logs detallados.
