import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { TaskExecutor } from './executor/taskExecutor.js';
import { Planner } from './planner/planner.js';
import { InMemoryQueue } from './queue/inMemoryQueue.js';
import { taskRoutes } from './routes/tasks.js';
import { TaskStore } from './storage/taskStore.js';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wsServer = new WebSocketServer({ server, path: '/logs' });

const planner = new Planner();
const queue = new InMemoryQueue();
const store = new TaskStore();
const executor = new TaskExecutor(queue, store, wsServer);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use(taskRoutes(planner, queue, store));

setInterval(() => executor.tick(), 1000);

wsServer.on('connection', (socket) => {
  socket.send(JSON.stringify({ taskId: 'system', line: 'log stream connected' }));
});

const port = Number(process.env.PORT ?? 4000);
server.listen(port, () => {
  console.log(`Orbit API listening on :${port}`);
});
