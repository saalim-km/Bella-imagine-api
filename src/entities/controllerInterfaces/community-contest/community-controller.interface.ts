import { Request, Response } from "express";

export interface ICommunityController {
  createCommunity(req: Request, res: Response): Promise<void>;
  listCommunities(req: Request, res: Response): Promise<void>;
  deleteCommunity(req: Request, res: Response): Promise<void>;
  findCommunityBySlug(req: Request, res: Response): Promise<void>;
  updateCommunity(req: Request, res: Response): Promise<void>;
  createCommunityMember(req: Request, res: Response): Promise<void>;
}
