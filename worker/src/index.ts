import express from 'express';
import { DagRunner } from './runner/dagRunner.js';
import { SandboxManager } from './sandbox/sandboxManager.js';
import { ToolRegistry } from './tools/toolRegistry.js';

const app = express();
app.use(express.json());

const runner = new DagRunner();
const sandbox = new SandboxManager();
const tools = new ToolRegistry();

tools.register('python', async (input) => ({ ok: true, output: `python executed with ${JSON.stringify(input)}` }));
tools.register('files', async (input) => ({ ok: true, output: `files handled ${JSON.stringify(input)}` }));
tools.register('shell', async (input) => ({ ok: true, output: `shell command ${JSON.stringify(input)}` }));
tools.register('web', async (input) => ({ ok: true, output: `web automation ${JSON.stringify(input)}` }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/execute', async (req, res) => {
  const taskId = String(req.body.taskId ?? 'unknown');
  const runtime = sandbox.start(taskId);

  try {
    const events = await runner.run(req.body.plan);
    await Promise.all(
      req.body.plan.steps.map((step: { tool: string; input: Record<string, unknown> }) => tools.run(step.tool, step.input))
    );

    res.json({ taskId, runtime, events, ok: true });
  } finally {
    sandbox.stop(runtime.containerId);
  }
});

const port = Number(process.env.PORT ?? 5001);
app.listen(port, () => {
  console.log(`Orbit worker listening on :${port}`);
});
