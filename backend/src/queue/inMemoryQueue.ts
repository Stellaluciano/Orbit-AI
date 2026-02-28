import { TaskPlan } from '../types.js';

export interface QueueMessage {
  taskId: string;
  plan: TaskPlan;
}

export class InMemoryQueue {
  private readonly messages: QueueMessage[] = [];

  enqueue(message: QueueMessage) {
    this.messages.push(message);
  }

  drain(): QueueMessage[] {
    return this.messages.splice(0, this.messages.length);
  }
}
