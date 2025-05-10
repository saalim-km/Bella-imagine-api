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
import { ILeaveCommunityUsecase } from "../../../entities/usecaseInterfaces/community-contest/community/leave-community-usecase.interface";
import path from "path";
import { IAwsS3Service } from "../../../entities/services/awsS3-service.interface";
import { unlinkSync } from "fs";
import { handleError } from "../../../shared/utils/error-handler.utils";

@injectable()
export class CommunityController implements ICommunityController {
  constructor(
    @inject("ICreateCommunityUsecase")
    private createCommunityUsecase: ICreateCommunityUsecase,
    @inject("IGetAllCommunityUsecase")
    private getAllCommunityUsecase: IGetAllCommunityUsecase,
    @inject("IDeleteCommunityUsecase")
    private deleteCommunityUsecase: IDeleteCommunityUsecase,
    @inject("IFindCommunityBySlugUsecase")
    private findCommunityBySlugUsecase: IFindCommunityBySlugUsecase,
    @inject("IUpdateCommunityUsecase")
    private updateCommunityUsecase: IUpdateCommunityUsecase,
    @inject("ICreateCommunityMemberUsecase")
    private createCommuintyMember: ICreateCommunityMemberUsecase,
    @inject("ILeaveCommunityUsecase")
    private leaveCommunityUsecase: ILeaveCommunityUsecase,
    @inject("IAwsS3Service") private awsS3Service: IAwsS3Service
  ) {}

  async createCommunity(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    console.log(req.files);
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    await this.createCommunityUsecase.execute({
      ...req.body,
      files: {
        iconImage: files.iconImage?.[0],
        coverImage: files.coverImage?.[0],
      },
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.CREATED,
    });
  }

  async listCommunities(req: Request, res: Response): Promise<void> {
    const { page, limit } = req.query;
    const data = await this.getAllCommunityUsecase.execute({
      page: Number(page),
      limit: Number(limit),
    });
    res.status(HTTP_STATUS.OK).json(data);
  }

  async deleteCommunity(req: Request, res: Response): Promise<void> {
    console.log("in deletecommunity controller");
    const { communityId } = req.body;
    console.log(communityId);
    await this.deleteCommunityUsecase.execute(communityId);
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: SUCCESS_MESSAGES.DELETE_SUCCESS });
  }

  async findCommunityBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;
    const { _id } = (req as CustomRequest).user;
    const communitySlug = `r/${slug}`;
    const community = await this.findCommunityBySlugUsecase.execute(
      communitySlug,
      _id
    );
    console.log(community);
    res.status(HTTP_STATUS.OK).json(community);
  }

  async updateCommunity(req: Request, res: Response): Promise<void> {
    console.log('in update community controller');
    console.log(req.body);
    console.log(req.files);
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    }

    await this.updateCommunityUsecase.execute({
      ...req.body,
      files : {
        iconImage: files.iconImage?.[0],
        coverImage: files.coverImage?.[0],
      }
    })
    
    res.status(HTTP_STATUS.OK).json({success : true , message : SUCCESS_MESSAGES.UPDATE_SUCCESS})
  }

  async createCommunityMember(req: Request, res: Response): Promise<void> {
    console.log("createCommunityMember", req.body);
    await this.createCommuintyMember.execute(req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true });
  }

  async leaveCommunity(req: Request, res: Response): Promise<void> {
    console.log("leaveCommunity", req.body);
    const { communityId } = req.body;
    const user = (req as CustomRequest).user;
    await this.leaveCommunityUsecase.execute(communityId, user._id);
    res.status(HTTP_STATUS.CREATED).json({ success: true });
  }
}
