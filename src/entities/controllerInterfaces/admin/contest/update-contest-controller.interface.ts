import { Request, Response } from "express";

export interface IUpdateContestController {
    handle(req : Request , res : Response) : Promise<void>
}