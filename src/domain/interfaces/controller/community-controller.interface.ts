import { Request, Response } from "express";

export interface ICommunityController {
  createCommunity(req: Request, res: Response): Promise<void>;
  fetchAllCommunity(req: Request, res: Response): Promise<void>;
  fetchCommunityDetais(req: Request, res: Response): Promise<void>;
  updateCommunity(req: Request, res: Response): Promise<void>;
  fetchAllCommunitiesForUser(req: Request, res: Response): Promise<void>;
  joinCommunity(req: Request, res: Response): Promise<void>;
  leaveCommunity(req: Request, res: Response): Promise<void>;
  getCommunityMembers(req: Request, res: Response): Promise<void>;
  createPost(req: Request, res: Response) : Promise<void>
  getAllPosts(req: Request, res: Response) : Promise<void>
  getPostDetails(req: Request, res: Response) : Promise<void>
  addComment(req: Request, res: Response) : Promise<void>
  fetchComments(req: Request, res: Response) : Promise<void>
  editComment(req: Request, res: Response) : Promise<void>
  deleteComment(req: Request, res: Response) : Promise<void>
  getAllPostForUser(req: Request, res: Response) : Promise<void>
  editPost(req: Request, res: Response) : Promise<void>
  deleteCommunityPost(req: Request, res: Response) : Promise<void>
}
