import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

import storage from "@/utils/storage";

const host = import.meta.env.VITE_BASE_CHAT;

export const connectionSocket = () => {
  const socket = io(host, {
    extraHeaders: {
      authorization: `${storage.getToken()}`,
    },
  });
  return socket;
};

export const emitSocket = (event: string, data: any) => {
  const socket = connectionSocket();
  socket.emit(event, data);
  // socket.disconnect();
};

export const disconnectSocket = (socket: Socket) => {
  socket.disconnect();
};
