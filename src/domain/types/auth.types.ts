import { TRole } from "../../shared/constants/constants";

export interface TJwtPayload {
  _id: string;
  email: string;
  role: TRole;
}

export interface JwtOutput {
  accessToken: string;
  refreshToken: string;
}
