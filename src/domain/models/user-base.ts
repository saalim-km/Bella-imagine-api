import { ObjectId } from "mongoose";
import { TRole } from "../shared/constants/constants";

export interface IUserBase {
  _id: ObjectId;
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