import { Request, Response } from "express";

export interface IGetAllBookingsClientController {
    handle(req : Request , res : Response) : Promise<void>
}