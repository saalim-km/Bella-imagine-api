import { inject, injectable } from "tsyringe";
import { ICommunityController } from "../../../entities/controllerInterfaces/community-contest/community-controller.interface";
import { ICreateCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/create-community-usecase.interface";
import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../../shared/constants";
import { IGetAllCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/get-all-communities-usecase.interface";
import { IDeleteCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/delete-community-usecase.interface";
import { IFindCommunityBySlugUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/find-by-slug-usecase.interface";
import { IUpdateCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/update-community-usecase.interface";
import { ICommunityEntity } from "../../../entities/models/community.entity";
import { ICreateCommunityMemberUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/create-community-member-usecase.interface";
import { CustomRequest } from "../../middlewares/auth.middleware";

@injectable()
export class CommunityController implements ICommunityController {
    constructor(
        @inject('ICreateCommunityUsecase') private createCommunityUsecase : ICreateCommunityUsecase,
        @inject("IGetAllCommunityUsecase") private getAllCommunityUsecase : IGetAllCommunityUsecase,
        @inject('IDeleteCommunityUsecase') private deleteCommunityUsecase : IDeleteCommunityUsecase,
        @inject("IFindCommunityBySlugUsecase") private findCommunityBySlugUsecase : IFindCommunityBySlugUsecase,
        @inject('IUpdateCommunityUsecase') private updateCommunityUsecase : IUpdateCommunityUsecase,
        @inject('ICreateCommunityMemberUsecase') private createCommuintyMember : ICreateCommunityMemberUsecase
    ){}

    async createCommunity(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body);
            await this.createCommunityUsecase.execute(req.body);
            res.status(HTTP_STATUS.CREATED).json({success: true , message : SUCCESS_MESSAGES.CREATED})
        } catch (error) {
            console.log(error);
        }
    }

    async listCommunities(req : Request , res : Response): Promise<void> {
        try {
            console.log(req.params);
            console.log(req.query);
            const {page , limit} = req.query;
            const data = await this.getAllCommunityUsecase.execute({page : Number(page) , limit : Number(limit)});
            res.status(HTTP_STATUS.OK).json(data);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCommunity(req: Request, res: Response): Promise<void> {
        try {
            console.log('in deletecommunity controller');
            const {communityId} = req.body;
            console.log(communityId);
            await this.deleteCommunityUsecase.execute(communityId)
            res.status(HTTP_STATUS.CREATED).json({success: true , message : SUCCESS_MESSAGES.DELETE_SUCCESS})
        } catch (error) {
            console.log(error);
        }
    }

    async findCommunityBySlug(req: Request, res: Response): Promise<void> {
        try {
            const {slug} = req.params;
            const {_id} = (req as CustomRequest).user
            const communitySlug = `r/${slug}`;
            const community = await this.findCommunityBySlugUsecase.execute(communitySlug,_id)
            console.log(community);
            res.status(HTTP_STATUS.OK).json(community);
        } catch (error) {
            console.log(error);
        }   
    }

    async updateCommunity(req: Request, res: Response): Promise<void> {
        try {
            const {communityId , dto } : {communityId : string , dto : Partial<ICommunityEntity>} = req.body;
            await this.updateCommunityUsecase.execute(communityId,dto)
            res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS})
        } catch (error) {
            console.log(error);
        }
    }

    async createCommunityMember(req: Request, res: Response): Promise<void> {
        try {
            console.log('createCommunityMember',req.body);
            await this.createCommuintyMember.execute(req.body)
            res.status(HTTP_STATUS.CREATED).json({success: true, message : SUCCESS_MESSAGES.JOINED_SUCESS})
        } catch (error) {
            console.log(error);
        }
    }
}