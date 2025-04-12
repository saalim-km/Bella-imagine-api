import { Request, Response } from "express";

export interface ICreateContestController {
    handle(req : Request , res : Response) : Promise<void>
}