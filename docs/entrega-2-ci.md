# Entrega 2 — Integración Continua con GitHub Actions

## Objetivo

Automatizar la validación del proyecto en cada `push` o `pull request` a las
ramas `main` y `develop`, ejecutando lint, pruebas y un smoke test contra el
contenedor del backend.

## Workflow

Archivo: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

### Triggers

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

### Etapas

| # | Etapa | Comando |
|---|---|---|
| 1 | Checkout | `actions/checkout@v4` |
| 2 | Setup Node | `actions/setup-node@v4` con `.nvmrc` y cache npm |
| 3 | Install backend | `npm ci` en `backend/` |
| 4 | Lint backend | `npm run lint` |
| 5 | Test backend | `npm test` (10 tests: unit + integración) |
| 6 | Install frontend | `npm ci` en `frontend/` |
| 7 | Lint frontend | `npm run lint` |
| 8 | Build frontend | `npm run build` (valida TS y empaqueta) |
| 9 | Build Docker | `docker compose build backend` |
| 10 | Up | `docker compose up -d` |
| 11 | Health check | `curl --retry 10` contra `/health` |
| 12 | Tear down | `docker compose down -v` (siempre, con `if: always()`) |

### Decisiones técnicas

- **`node-version-file: '.nvmrc'`** en lugar de hardcodear `'20'` → única
  fuente de verdad entre dev local y CI.
- **Cache npm con `cache-dependency-path`** apuntando a ambos lockfiles →
  acelera installs sin invalidaciones cruzadas.
- **`mongodb-memory-server` en tests unitarios** → el job de tests no necesita
  un contenedor Mongo real; eso queda para el smoke test final.
- **Smoke test con retry** (10 intentos × 3s) → cubre la ventana entre el
  `up` y que el backend acepte conexiones, sin `sleep` arbitrarios.
- **`tear down` con `if: always()`** → siempre limpia, incluso si el smoke
  test falla.

## Badge

Añadido al `README.md`:

```markdown
![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)
```

Sustituir `OWNER/REPO` por el path real del repositorio en GitHub.

## Branch protection

Ver [`branch-protection.md`](branch-protection.md) para configurar la regla que
exige el workflow verde antes de mergear a `main`.

## Validación local previa al push

Antes de hacer push, el mismo pipeline puede simularse localmente:

```bash
# backend
cd backend && npm ci && npm run lint && npm test && cd ..

# frontend
cd frontend && npm ci && npm run lint && npm run build && cd ..

# docker smoke
docker compose up -d --build
curl --retry 10 --retry-delay 3 http://localhost:3000/health
docker compose down -v
```

## Evidencia de ejecución

Una vez el repositorio esté en GitHub y se ejecute el primer workflow, capturar:

1. Vista del workflow en la pestaña **Actions** (verde).
2. Logs de cada step (especialmente test + smoke test).
3. URL pública del run.

Pegar las capturas en [`evidencias.md`](evidencias.md).
