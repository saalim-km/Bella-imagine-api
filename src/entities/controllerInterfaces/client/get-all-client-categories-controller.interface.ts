import { Request, Response } from "express";

export interface IGetAllClientCategoriesController {
    handle(req : Request , res : Response) : Promise<void>
}