import { WebSocketServer } from 'ws';
import { InMemoryQueue } from '../queue/inMemoryQueue.js';
import { TaskStore } from '../storage/taskStore.js';

export class TaskExecutor {
  constructor(
    private readonly queue: InMemoryQueue,
    private readonly store: TaskStore,
    private readonly wsServer: WebSocketServer
  ) {}

  tick() {
    for (const message of this.queue.drain()) {
      const task = this.store.get(message.taskId);
      if (!task) continue;
      task.status = 'running';

      for (const step of message.plan.steps) {
        this.emitLog(message.taskId, `[${step.id}] ${step.title}`);
      }

      task.status = 'completed';
      this.store.addArtifact({
        id: `${message.taskId}-summary`,
        taskId: message.taskId,
        name: 'summary.md',
        path: `tasks/${message.taskId}/summary.md`
      });
      this.emitLog(message.taskId, 'Task completed');
    }
  }

  private emitLog(taskId: string, line: string) {
    const payload = JSON.stringify({ taskId, line });
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    });
  }
}
