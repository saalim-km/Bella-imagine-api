import { TRole } from "../../constants";

export interface TJwtPayload {
    _id : string,
    email : string,
    role : TRole,
}