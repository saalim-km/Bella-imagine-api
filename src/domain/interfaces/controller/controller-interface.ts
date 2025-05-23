import { Request } from "express";

export interface IBaseController {
    handle(req : Request , res : Response) : Promise<void>
}