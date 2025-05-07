import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { Request, Response } from "express";

export interface IChatController {
  io?: SocketIOServer;
  initialize(server: HTTPServer): void;
  initializeSocketEvents(): void;
  uploadMedia(req : Request , res : Response): Promise<void>
}
