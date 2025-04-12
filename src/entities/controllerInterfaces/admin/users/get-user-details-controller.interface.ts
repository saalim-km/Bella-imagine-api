import {Request , Response} from 'express'

export interface IGetUserDetailsController {
    handle(req : Request , res : Response) : Promise<void>
}