# Orbit AI Architecture

Orbit AI is a personal AI computer that turns prompts into deterministic workflow execution.

## Layers
1. **Workspace UI (Next.js)**: task input, timeline, logs, and artifact explorer.
2. **Control Plane (API Server)**: planner, task manager, DAG lifecycle.
3. **Execution Layer (Worker)**: deterministic DAG runner, tool invocation, retries.
4. **Sandbox Runtime**: containerized execution with restricted filesystem and optional browser automation.
5. **Storage**: PostgreSQL metadata, Redis queueing, S3-compatible artifact storage.

## MVP execution flow
1. User submits a task from UI.
2. Planner converts prompt to JSON DAG.
3. Executor enqueues run and streams logs over WebSocket.
4. Worker executes steps and emits artifacts.
5. Workspace refreshes artifacts and displays results.
