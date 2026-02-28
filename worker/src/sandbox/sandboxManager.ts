export class SandboxManager {
  start(taskId: string) {
    return {
      containerId: `sandbox-${taskId}`,
      workspacePath: `/tmp/orbit/${taskId}`
    };
  }

  stop(containerId: string) {
    return { containerId, stopped: true };
  }
}
