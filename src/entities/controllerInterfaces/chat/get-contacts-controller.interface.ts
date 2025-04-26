import { Request , Response} from "express";

export interface IGetContactsController {
    handle(req : Request , res : Response) : Promise<void> 
}