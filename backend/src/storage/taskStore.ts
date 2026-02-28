import { ArtifactRecord, TaskRecord } from '../types.js';

export class TaskStore {
  private readonly tasks = new Map<string, TaskRecord>();
  private readonly artifacts = new Map<string, ArtifactRecord[]>();

  create(task: TaskRecord) {
    this.tasks.set(task.id, task);
  }

  list() {
    return [...this.tasks.values()];
  }

  get(taskId: string) {
    return this.tasks.get(taskId);
  }

  addArtifact(artifact: ArtifactRecord) {
    const current = this.artifacts.get(artifact.taskId) ?? [];
    current.push(artifact);
    this.artifacts.set(artifact.taskId, current);
  }

  getArtifacts(taskId: string) {
    return this.artifacts.get(taskId) ?? [];
  }
}
