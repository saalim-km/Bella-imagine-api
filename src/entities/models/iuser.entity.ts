// src/entities/user.entity.ts (Unified for client and vendor)
import { ObjectId } from "mongoose";
import { TRole } from "../../shared/constants";
import { IVendorEntity } from "./vendor.entity";

export interface IUserEntityForChat extends IVendorEntity {
}