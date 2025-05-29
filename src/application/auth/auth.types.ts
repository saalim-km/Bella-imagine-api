import { TRole } from "../../shared/constants/constants";

export interface RegisterUserInput {
    name : string;
    email : string;
    role : TRole;
    password : string;
    googleId ?: string;
}