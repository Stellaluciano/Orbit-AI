'use client';

import { useEffect, useState } from 'react';

export function useLogStream(taskId?: string) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!taskId) {
      setLogs([]);
      return;
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_LOG_WS_URL ?? 'ws://localhost:4000'}/logs?taskId=${taskId}`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      setLogs((prev) => [...prev.slice(-199), event.data]);
    };

    socket.onclose = () => {
      setLogs((prev) => [...prev, 'log stream disconnected']);
    };

    return () => socket.close();
  }, [taskId]);

  return logs;
}
