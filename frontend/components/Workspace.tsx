'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Artifact, TaskStep } from '../lib/types';
import { useLogStream } from '../lib/useLogStream';

interface SubmitResponse {
  taskId: string;
  plan: TaskStep[];
}

export function Workspace() {
  const [prompt, setPrompt] = useState('Build a Python report about top 10 AI repositories this week.');
  const [taskId, setTaskId] = useState<string>();
  const [plan, setPlan] = useState<TaskStep[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const logs = useLogStream(taskId);

  const grouped = useMemo(() => {
    const byStatus: Record<string, TaskStep[]> = { pending: [], running: [], success: [], failed: [] };
    for (const step of plan) {
      byStatus[step.status].push(step);
    }
    return byStatus;
  }, [plan]);

  async function submitTask(event: FormEvent) {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = (await response.json()) as SubmitResponse;
    setTaskId(data.taskId);
    setPlan(data.plan);
    setArtifacts([]);
  }

  async function refreshArtifacts() {
    if (!taskId) return;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'}/tasks/${taskId}/artifacts`);
    const data = (await response.json()) as Artifact[];
    setArtifacts(data);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-3xl font-semibold">Orbit AI Workspace</h1>
        <p className="text-slate-400">Task Input • Execution Timeline • Logs • Artifact Explorer</p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <form onSubmit={submitTask} className="flex flex-col gap-3">
          <label className="text-sm text-slate-300">Task prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-24 rounded-lg bg-slate-950 p-3" />
          <button className="w-fit rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500" type="submit">
            Submit task
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-2 font-semibold">Execution timeline</h2>
          {(['pending', 'running', 'success', 'failed'] as const).map((status) => (
            <div key={status} className="mb-3">
              <h3 className="text-xs uppercase tracking-wide text-slate-400">{status}</h3>
              <ul className="mt-1 space-y-1 text-sm">
                {grouped[status].map((step) => (
                  <li key={step.id} className="rounded bg-slate-950 px-2 py-1">
                    {step.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:col-span-2">
          <h2 className="mb-2 font-semibold">Live logs</h2>
          <div className="h-72 overflow-auto rounded-lg bg-black p-3 font-mono text-xs text-green-400">
            {logs.length === 0 ? 'No logs yet.' : logs.map((line, idx) => <div key={`${line}-${idx}`}>{line}</div>)}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Artifacts</h2>
          <button className="rounded-lg border border-slate-700 px-3 py-1 text-sm" onClick={refreshArtifacts} type="button">
            Refresh
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {artifacts.length === 0 ? (
            <li className="text-slate-400">No artifacts available.</li>
          ) : (
            artifacts.map((artifact) => (
              <li key={artifact.id} className="rounded bg-slate-950 px-3 py-2">
                {artifact.name} <span className="text-slate-500">({artifact.path})</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}
