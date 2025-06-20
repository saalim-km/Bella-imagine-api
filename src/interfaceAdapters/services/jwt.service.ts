import { injectable } from "tsyringe";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ms from "ms";
import { config } from "../../shared/config/config";
import { IJwtservice } from "../../domain/interfaces/service/jwt-service.interface";
import { TJwtPayload } from "../../domain/types/auth.types";

@injectable()
export class JwtService implements IJwtservice {
  private accessSecret: Secret;
  private accessExpireIn: string;
  private refreshSecret: Secret;
  private refreshExpireIn: string;

  constructor() {
    (this.accessSecret = config.jwt.ACCESS_SECRET_KEY),
      (this.accessExpireIn = config.jwt.ACCESS_EXPIRES_IN),
      (this.refreshExpireIn = config.jwt.REFRESH_EXPIRES_IN),
      (this.refreshSecret = config.jwt.REFRESH_SECRET_KEY);
  }

  generateAccessToken(data: TJwtPayload): string {
    console.log('access token expiry time : ',this.accessExpireIn);
    return jwt.sign(data, this.accessSecret, {
      expiresIn: this.accessExpireIn as ms.StringValue,
    });
  }

  generateRefreshToken(data: TJwtPayload): string {
    console.log('refersh token expiry time : ',this.refreshExpireIn);
    return jwt.sign(data, this.refreshSecret, {
      expiresIn: this.refreshExpireIn as ms.StringValue,
    });
  }

  verifyAccessToken(token: string): JwtPayload | null {
    return jwt.verify(token, this.accessSecret) as TJwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    return jwt.verify(token, this.refreshSecret) as TJwtPayload;
  }

  decodeRefreshToken(token: string): JwtPayload | null {
    const decode = jwt.decode(token) as JwtPayload;
    return decode;
  }
}
