# Orbit AI Tool System

Tools are loaded by the worker runtime and provide deterministic side effects.

## Built-in tools
- `python`: run constrained Python snippets.
- `shell`: run safe shell commands in sandbox.
- `files`: read/write workspace files.
- `web`: optional browser automation for data collection.

## Plugin contract
Each tool plugin exposes:

```ts
export interface OrbitToolPlugin {
  name: string;
  run(input: Record<string, unknown>): Promise<{ ok: boolean; output: string }>;
}
```
