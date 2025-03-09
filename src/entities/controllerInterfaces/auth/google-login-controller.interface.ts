import { Request , Response } from "express";

export interface IGoogleLoginController {
    handle(req : Request , res :Response) : Promise<void>
}