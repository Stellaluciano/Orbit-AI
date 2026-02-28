export type StepStatus = 'pending' | 'running' | 'success' | 'failed';

export interface TaskStep {
  id: string;
  title: string;
  dependsOn: string[];
  status: StepStatus;
}

export interface Artifact {
  id: string;
  name: string;
  path: string;
}
