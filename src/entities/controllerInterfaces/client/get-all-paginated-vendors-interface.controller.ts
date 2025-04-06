import { Request, Response } from "express";

export interface IGetAllPaginatedVendorsController {
    handle(req : Request , res : Response) : Promise<void>
}