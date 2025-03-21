import {Request , Response} from 'express'

export interface IGetCategoryRequestController {
    handle(req : Request , res : Response) : Promise<void>
}