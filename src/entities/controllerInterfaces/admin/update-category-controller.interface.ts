import { Request, Response } from "express";

export interface IUpdateCategoryController {
    handle(req : Request , res : Response) : Promise<void>
    
}