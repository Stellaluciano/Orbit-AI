import { z } from 'zod';
import { TaskPlan } from '../types.js';

const requestSchema = z.string().min(3);

export class Planner {
  buildPlan(prompt: string): TaskPlan {
    requestSchema.parse(prompt);

    return {
      version: '1.0',
      steps: [
        {
          id: 'analyze-request',
          title: 'Analyze objective and define deliverables',
          tool: 'files',
          input: { prompt },
          dependsOn: [],
          retries: 1,
          budgetMs: 5000
        },
        {
          id: 'execute-work',
          title: 'Execute core task logic in sandbox',
          tool: 'python',
          input: { prompt },
          dependsOn: ['analyze-request'],
          retries: 2,
          budgetMs: 60000
        },
        {
          id: 'package-artifacts',
          title: 'Collect outputs and register artifacts',
          tool: 'files',
          input: { outputDir: 'artifacts' },
          dependsOn: ['execute-work'],
          retries: 1,
          budgetMs: 5000
        }
      ]
    };
  }
}
