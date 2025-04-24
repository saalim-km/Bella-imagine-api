import { Request, Response } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

export interface IChatController {
  io?: SocketIOServer;
  initialize(server: HTTPServer): void;
  initializeSocketEvents(): void;
  handle(req: Request, res: Response): Promise<void>;
}
