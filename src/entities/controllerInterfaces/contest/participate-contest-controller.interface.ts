import { Request, Response } from "express";

export interface IParticipateContestController {
    handle(req : Request , res : Response) : Promise<void>
}