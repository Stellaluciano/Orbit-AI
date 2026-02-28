import { z } from 'zod';

const stepSchema = z.object({
  id: z.string(),
  title: z.string(),
  tool: z.enum(['python', 'shell', 'files', 'web']),
  input: z.record(z.unknown()),
  dependsOn: z.array(z.string()),
  retries: z.number().optional(),
  budgetMs: z.number().optional()
});

const planSchema = z.object({
  version: z.literal('1.0'),
  steps: z.array(stepSchema)
});

export type RunEvent = { stepId: string; state: 'started' | 'completed'; log: string };

export class DagRunner {
  async run(planInput: unknown): Promise<RunEvent[]> {
    const plan = planSchema.parse(planInput);
    const completed = new Set<string>();
    const events: RunEvent[] = [];

    for (const step of plan.steps) {
      const dependenciesDone = step.dependsOn.every((dep) => completed.has(dep));
      if (!dependenciesDone) {
        throw new Error(`Step ${step.id} dependencies are not satisfied`);
      }

      events.push({ stepId: step.id, state: 'started', log: `${step.title} started` });
      await new Promise((resolve) => setTimeout(resolve, 100));
      events.push({ stepId: step.id, state: 'completed', log: `${step.title} completed` });
      completed.add(step.id);
    }

    return events;
  }
}
