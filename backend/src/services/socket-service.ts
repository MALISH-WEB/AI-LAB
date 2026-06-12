import { Server } from 'socket.io';

let ioInstance: Server | null = null;

export const setSocketServer = (server: Server): void => {
  ioInstance = server;
};

export const getSocketServer = (): Server | null => ioInstance;
