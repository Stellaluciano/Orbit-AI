# Orbit AI

Orbit AI is an open-source **personal AI computer** that plans and executes complex tasks in a secure workspace. Instead of a chat-only interface, Orbit AI produces real artifacts such as code, reports, datasets, and generated files.

## MVP capabilities
- Submit a task from a web workspace.
- Generate a structured JSON DAG plan.
- Execute DAG steps deterministically in a worker runtime.
- Stream logs over WebSocket.
- Surface generated artifacts in the UI.

## Monorepo structure

```txt
orbit-ai/
├── frontend/   # Next.js + React + Tailwind workspace UI
├── backend/    # Node.js/TypeScript API + planner + orchestration
├── worker/     # Deterministic DAG execution and tool runners
├── sandbox/    # Container runtime image and startup scripts
├── tools/      # Tool contracts and plugin documentation
├── sdk/        # Orbit AI SDK client interfaces
└── docs/       # Architecture and roadmap docs
```

## Architecture principles
- **LLM as planner:** plan once into a typed DAG.
- **Deterministic execution:** runtime executes graph edges predictably.
- **Sandbox-first:** workers run tasks in isolated containers.
- **Artifact-centric:** every run can publish files and metadata.
- **Composable plugins:** tools are modular and easy to extend.

## Local development

### Prerequisites
- Node.js 20+
- Docker + Docker Compose

### Run with docker-compose

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Worker: http://localhost:5001
- MinIO console: http://localhost:9001

### Run without Docker

```bash
npm install
npm run dev
```

## Core modules (implemented)
1. **Planner** (`backend/src/planner`) — converts prompt → JSON DAG.
2. **Task Executor** (`backend/src/executor`) — drains queue, streams logs, stores artifacts.
3. **Tool System** (`worker/src/tools`) — pluggable tool handlers for python/files/shell/web.
4. **Workspace** (`frontend/components/Workspace.tsx`) — task input, timeline, logs, artifacts.
5. **Web UI** (`frontend/app/page.tsx`) — Next.js app shell for the Orbit workspace.

## Next steps
- Replace in-memory queue/storage with Redis + PostgreSQL adapters.
- Integrate true sandbox container lifecycle from worker.
- Add authentication, run policies, and budget controls.
- Persist artifact blobs to S3-compatible object storage.
