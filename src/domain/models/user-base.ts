import { Types } from "mongoose";
import { TRole } from "../../shared/constants/constants";
import { IClient } from "./client";
import { IVendor } from "./vendor";
import { IAdmin } from "./admin";

export interface IUserBase {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: number;
  password: string;
  profileImage: string;
  googleId: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  role: TRole
  isblocked: boolean;
  isOnline: boolean;
  lastSeen: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

export type IUser = IClient | IVendor | IAdmin