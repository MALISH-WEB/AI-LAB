# AI-Powered Unified Virtual Lab Ecosystem

A modular monorepo for an AI-driven virtual lab platform with authentication, networking simulation MVP, AI tutoring APIs, competency tracking, and offline-capable frontend UX.

## Monorepo Structure

- `/backend` - Node.js + Express + TypeScript API, PostgreSQL(TypeORM), Socket.io, JWT auth
- `/frontend` - Next.js 14 + TypeScript dashboard, networking lab UI, offline sync helpers
- `/shared` - Shared domain types used across backend/frontend
- `/docker` - Dockerfiles for local orchestration
- `docker-compose.yml` - Local stack (PostgreSQL + backend + frontend)
- `.github/workflows` - CI checks (build + backend tests)

## MVP Included (Phase 1)

- JWT access/refresh authentication with bcrypt password hashing and RBAC (`student`, `instructor`, `admin`)
- Networking virtual lab with 3 scenarios:
  1. Basic Network Configuration
  2. Routing Protocol Setup (OSPF/BGP)
  3. Network Troubleshooting
- AI assistant endpoints (JSON + streaming) with OpenAI-first and local fallback behavior
- Competency model and mastery scoring:
  `mastery = (accuracy × 0.4) + (completionSpeed × 0.3) + (conceptUnderstanding × 0.3)`
- Progress persistence entities for sessions, simulation events, competencies, AI interactions, and assignments
- Real-time updates through Socket.io simulation events
- Offline-first frontend utilities (service worker registration + IndexedDB sync queue)

## Local Development

### Prerequisites

- Node.js 18+
- npm 9+
- Docker + Docker Compose (optional but recommended)

### Quick start with Docker

```bash
docker compose up --build
```

### Local without Docker

```bash
npm install
npm run build -w shared
npm run dev -w backend
npm run dev -w frontend
```

Backend: `http://localhost:4000`
Frontend: `http://localhost:3000`

## Core API Groups

- `/api/auth` - register/login/refresh/me
- `/api/labs` - lab CRUD + listing
- `/api/progress` - session/progress tracking
- `/api/competency` - skill progression and mastery updates
- `/api/ai` - contextual tutoring and streaming responses
- `/api/simulation` - networking scenarios and action validation
- `/api/admin` - user and assignment management

## CI

GitHub Actions workflow runs backend tests and monorepo build checks on pull requests.
