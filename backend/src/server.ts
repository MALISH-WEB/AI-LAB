import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { setSocketServer } from './services/socket-service';

const app = createApp();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: env.frontendUrl, credentials: true }
});
setSocketServer(io);

io.on('connection', (socket) => {
  const userId = socket.handshake.auth?.userId as string | undefined;
  if (userId) {
    socket.join(userId);
  }

  socket.on('simulation:command', (payload) => {
    socket.emit('simulation:ack', { received: true, payload });
  });
});

const bootstrap = async () => {
  await AppDataSource.initialize();

  httpServer.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  bootstrap().catch((error) => {
    console.error('Failed to initialize backend', error);
    process.exit(1);
  });
}

export { app, bootstrap };
