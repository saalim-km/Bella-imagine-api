import { Request, Response } from "express";

export interface ILoginControllerInterface {
    handle(req : Request , res : Response) : Promise<void>
}