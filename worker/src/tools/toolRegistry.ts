export type ToolHandler = (input: Record<string, unknown>) => Promise<{ ok: boolean; output: string }>;

export class ToolRegistry {
  private readonly tools = new Map<string, ToolHandler>();

  register(name: string, handler: ToolHandler) {
    this.tools.set(name, handler);
  }

  async run(name: string, input: Record<string, unknown>) {
    const handler = this.tools.get(name);
    if (!handler) {
      throw new Error(`Tool ${name} not registered`);
    }

    return handler(input);
  }
}
