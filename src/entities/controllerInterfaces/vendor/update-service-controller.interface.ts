import { Request, Response } from "express";

export interface IUpdateServiceController {
    handle(req : Request , res : Response) :Promise<void>
}