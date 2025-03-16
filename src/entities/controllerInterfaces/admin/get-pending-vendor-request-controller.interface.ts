import {Request , Response} from 'express'

export interface IGetPendingVendorRequestController {
    handle(req : Request , res : Response) : Promise<void>
}