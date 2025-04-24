// src/entities/user.entity.ts (Unified for client and vendor)
import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";

export interface IUserEntityForChat {
  _id: string | ObjectId;
  name: string;
  email: string;
  profileImage?: string;
  password?: string;
  phoneNumber?: string;
  location?: string;
  googleId?: string;
  role: TRole;
  isOnline: boolean;
  lastSeen: Date;
  isActive: boolean;
  isblocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}