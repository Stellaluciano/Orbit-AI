export type StepStatus = 'pending' | 'running' | 'success' | 'failed';

export interface DagStep {
  id: string;
  title: string;
  tool: 'python' | 'shell' | 'files' | 'web';
  input: Record<string, unknown>;
  dependsOn: string[];
  retries?: number;
  budgetMs?: number;
}

export interface TaskPlan {
  version: '1.0';
  steps: DagStep[];
}

export interface TaskRecord {
  id: string;
  prompt: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  createdAt: string;
}

export interface ArtifactRecord {
  id: string;
  taskId: string;
  name: string;
  path: string;
}
