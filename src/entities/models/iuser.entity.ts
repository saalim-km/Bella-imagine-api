// src/entities/user.entity.ts (Unified for client and vendor)
import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";
import { IVendorEntity } from "./vendor.entity";

export interface IUserEntityForChat {
  _id: string;
  name: string;
  email: string;
  role: TRole;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}
