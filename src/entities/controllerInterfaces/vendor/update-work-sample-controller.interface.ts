import { Request, Response } from "express";

export interface IUpdateWorkSampleController {
    handle(req : Request , res : Response) :Promise<void>
}