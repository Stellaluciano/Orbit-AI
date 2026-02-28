import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { Planner } from '../planner/planner.js';
import { InMemoryQueue } from '../queue/inMemoryQueue.js';
import { TaskStore } from '../storage/taskStore.js';

export function taskRoutes(planner: Planner, queue: InMemoryQueue, store: TaskStore) {
  const router = Router();

  router.post('/tasks', (req, res) => {
    const prompt = String(req.body?.prompt ?? '');
    const plan = planner.buildPlan(prompt);
    const taskId = uuid();

    store.create({
      id: taskId,
      prompt,
      status: 'queued',
      createdAt: new Date().toISOString()
    });

    queue.enqueue({ taskId, plan });

    res.status(202).json({
      taskId,
      plan: plan.steps.map((step) => ({ ...step, status: 'pending' }))
    });
  });

  router.get('/tasks', (_req, res) => {
    res.json(store.list());
  });

  router.get('/tasks/:taskId/artifacts', (req, res) => {
    res.json(store.getArtifacts(req.params.taskId));
  });

  return router;
}
