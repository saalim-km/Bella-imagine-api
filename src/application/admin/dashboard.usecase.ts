import { inject, injectable } from "tsyringe";
import { IDashboardUsecase } from "../../domain/interfaces/usecase/admin-usecase.interface";
import { IAdminRepository } from "../../domain/interfaces/repository/admin-repository";
import { IAwsS3Service } from "../../domain/interfaces/service/aws-service.interface";
import { IGetPresignedUrlUsecase } from "../../domain/interfaces/usecase/common-usecase.interfaces";

@injectable()
export class DashBoardUsecase implements IDashboardUsecase {
  constructor(
    @inject("IAdminRepository") private _adminRepository: IAdminRepository,
    @inject("IAwsS3Service") private _awsS3Service: IAwsS3Service,
    @inject("IGetPresignedUrlUsecase")
    private _presignedUrl: IGetPresignedUrlUsecase
  ) {}

  async fetchDashBoardStats(): Promise<any> {
    const dashBoardStats = await this._adminRepository.getDashboardStats();
    console.log("printing recent users");
    console.log(dashBoardStats.recentUsers);

    dashBoardStats.recentUsers = await Promise.all(
      dashBoardStats.recentUsers.map(async (user) => {
        if (user.profileImage) {
          const isFileExistsInS3 =
            await this._awsS3Service.isFileAvailableInAwsBucket(
              user.profileImage
            );
          if (isFileExistsInS3) {
            user.profileImage = await this._presignedUrl.getPresignedUrl(
              user.profileImage
            );
          }
        }

        return user;
      })
    );

    dashBoardStats.recentPosts = await Promise.all(
      dashBoardStats.recentPosts.map(async (post) => {
        if (post.userId.profileImage) {
          const isFileExistsInS3 =
            await this._awsS3Service.isFileAvailableInAwsBucket(
              post.userId.profileImage
            );
          if (isFileExistsInS3) {
            post.userId.profileImage = await this._presignedUrl.getPresignedUrl(
              post.userId.profileImage
            );
          }
        }

        return post;
      })
    );

    return dashBoardStats;
  }
}
