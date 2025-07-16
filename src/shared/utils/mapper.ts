import { LoginUserOuput } from "../../domain/interfaces/usecase/types/auth.types";
import { ICategory } from "../../domain/models/category";
import { ICategoryRequest } from "../../domain/models/category-request";
import { IClient } from "../../domain/models/client";
import { ICommunity, ICommunityPost } from "../../domain/models/community";
import { INotification } from "../../domain/models/notification";
import { IUserBase } from "../../domain/models/user-base";
import { IVendor } from "../../domain/models/vendor";
import { PopulatedWallet } from "../../domain/models/wallet";
import { GetPostForUserOutput } from "../../domain/types/community.types";

type UserListItem = {
  _id?: any;
  name?: string;
  email?: string;
  role?: string;
  isVerified?: string;
  isblocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Mapper {
  static vendorMapper(vendor: IVendor): Partial<Partial<IVendor>> {
    return {
      _id: vendor._id,
      vendorId: vendor.vendorId,
      name: vendor.name,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
      location: vendor.location,
      geoLocation: vendor.geoLocation,
      profileImage: vendor.profileImage,
      isOnline: vendor.isOnline,
      isVerified: vendor.isVerified,
      role: vendor.role,
      verificationDocument: vendor.verificationDocument,
      workSamples: vendor.workSamples,
      isblocked: vendor.isblocked,
      lastSeen: vendor.lastSeen,
      languages: vendor.languages || [],
      services: vendor.services || [],
      categories: vendor.categories || [],
      description: vendor.description || "",
      portfolioWebsite: vendor.portfolioWebsite || "",
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    };
  }

  static vendorListMapper(vendors: Partial<IVendor>[]) {
    return vendors.map(this.usersMapper);
  }

  static clientMapper(client: Partial<IClient>): Partial<IClient> {
    return {
      _id: client._id,
      name: client.name,
      email: client.email,
      phoneNumber: client.phoneNumber,
      profileImage: client.profileImage,
      location: client.location,
      geoLocation: client.geoLocation,
      role: client.role,
      isOnline: client.isOnline,
      lastSeen: client.lastSeen,
      isblocked: client.isblocked,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  static clientListMapper(clients: Partial<IClient>[]) {
    return clients.map(this.usersMapper);
  }

  static usersMapper(user: UserListItem): Partial<UserListItem> {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified || "",
      isblocked: user.isblocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static userMapper(user: IUserBase): LoginUserOuput {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.profileImage || "",
    };
  }

  static categoryMapper(category: ICategory): ICategory {
    return {
      _id: category._id,
      categoryId: category.categoryId,
      title: category.title,
      status: category.status,
    };
  }

  static categoryListMapper(category: ICategory[]): Partial<ICategory[]> {
    return category.map(this.categoryMapper);
  }

  static categoryReqMapper(req: ICategoryRequest): Partial<any> {
    return {
      _id: req._id.toString(),
      vendorId: req.vendorId,
      categoryId: req.categoryId,
      status: req.status,
    };
  }

  static categoryReqList(req: ICategoryRequest[]): Partial<any[]> {
    return req.map(this.categoryReqMapper);
  }

  static mapWalletData = (rawData: PopulatedWallet): any => {
    return {
      balance: rawData.balance,
      paymentId: rawData.paymentId.map((transaction: any): any => ({
        transactionId: transaction.transactionId,
        createdAt: transaction.createdAt,
        purpose: transaction.purpose,
        amount: transaction.amount,
        status: transaction.status,
      })),
    };
  };

  static notificationMapper(notific : INotification) : Partial<INotification> {
    return {
      type : notific.type,
      message : notific.message,
      isRead : notific.isRead,
      createdAt : notific.createdAt,
    }
  }

  static notificationList(notifications : INotification[]) : any {
    return notifications.flatMap(this.notificationMapper)
  }



  static communityMapper(comm : ICommunity) : Partial<ICommunity> {
    return {
      name : comm.name,
      slug : comm.slug,
      description : comm.description,
      coverImage: comm.coverImage,
      iconImage : comm.iconImage,
      memberCount : comm.memberCount,
    }
  }

  static communityList(communities : ICommunity[]) : any {
    return communities.map(this.communityMapper)
  }

  static postMapper(post : any) : any {
    return {
      _id : post._id,
      title :post.title,
      content : post.content,
      media : post.media,
      mediaType : post.mediaType,
      commentCount : post.commentCount,
      comments : post.comments,
      iconImage : post.iconImage,
      communityName : post.communityName,
      tags : post.tags,
      likeCount : post.likeCount
    }
  }

  static postMapperListForUser(posts : GetPostForUserOutput[]): any {
    return posts.map(this.postMapper)
  }

  // static commentMapper(comment : any) {
  //   return {
  //     _id : comment._id,
  //     content : comment.content,
  //     createdAt : comment.createdAt,
  //     userType : comment.userType,
  //     postId : comment.postId,
  //     post : [
  //       {
  //         title : 
  //       }
  //     ]
  //   }
  // }
}
