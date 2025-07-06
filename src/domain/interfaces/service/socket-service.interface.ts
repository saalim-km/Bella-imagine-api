import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export interface ISocketService {
  io?: SocketIOServer;
  initialize(server: HTTPServer): void;
  initializeSocketEvents(): void;
}
