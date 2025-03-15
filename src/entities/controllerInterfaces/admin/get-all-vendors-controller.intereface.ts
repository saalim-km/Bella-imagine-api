import {Request , Response} from 'express'

export interface IGetAllVendorsController {
    handle(req : Request , res : Response) : Promise<void>
}