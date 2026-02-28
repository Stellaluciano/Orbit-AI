export interface CreateTaskRequest {
  prompt: string;
}

export interface CreateTaskResponse {
  taskId: string;
  plan: Array<{
    id: string;
    title: string;
    status: 'pending' | 'running' | 'success' | 'failed';
  }>;
}

export class OrbitClient {
  constructor(private readonly baseUrl: string) {}

  async createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request)
    });

    return response.json() as Promise<CreateTaskResponse>;
  }
}
