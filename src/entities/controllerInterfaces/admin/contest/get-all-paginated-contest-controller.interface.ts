import { Request, Response } from "express";

export interface IGetPaginatedContestController {
    handle(req : Request , res : Response) : Promise<void>
}