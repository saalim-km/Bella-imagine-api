import { Request, Response } from "express";

export interface IGetPhotographerDetailsController {
    handle(req : Request , res : Response) : Promise<void>
}