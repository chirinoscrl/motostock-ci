# MotoStock CI

Sistema básico de inventario de repuestos de motos con integración continua.

Proyecto académico enfocado en demostrar prácticas de control de versiones,
contenerización, pruebas automatizadas y pipelines de CI con GitHub Actions.

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** NestJS + TypeScript
- **Base de datos:** MongoDB (Mongoose)
- **Contenedores:** Docker + Docker Compose
- **CI:** GitHub Actions

## Estructura

```
motostock-ci/
├── backend/        API REST en NestJS
├── frontend/       SPA en React + Vite
├── docs/           Documentación técnica y evidencias
├── .github/        Workflows de CI
└── docker-compose.yml
```

## Requisitos

- Node.js 20+
- Docker y Docker Compose
- npm

## Ejecución local (próximamente)

```bash
docker compose up --build
```

## Estado

🚧 Fase 1 — Estructura base del proyecto.
