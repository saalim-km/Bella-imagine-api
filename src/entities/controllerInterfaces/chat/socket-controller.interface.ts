import { Request, Response } from 'express';
import { Server } from 'http';

export interface ISocketController {
    initializeSocket (server : Server) : void,
    initializeSocketEvents () : void
}