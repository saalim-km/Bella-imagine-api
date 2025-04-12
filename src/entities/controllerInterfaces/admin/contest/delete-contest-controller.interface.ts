import { Request, Response } from "express";

export interface IDeleteContestController {
    handle(req : Request , res : Response) : Promise<void>
}