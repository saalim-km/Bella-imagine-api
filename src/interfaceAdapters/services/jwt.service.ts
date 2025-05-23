import { injectable } from "tsyringe";
import { IJwtservice } from "../../entities/services/jwt.service";
import { TJwtPayload } from "../../shared/types/auth/jwt-payload.type";
import jwt,{ JwtPayload, Secret } from "jsonwebtoken";
import { config } from "../../shared/config";
import ms from "ms";

@injectable()
export class JwtService implements IJwtservice {
    private accessSecret : Secret;
    private accessExpireIn : string;
    private refreshSecret : Secret;
    private refreshExpireIn : string;

    constructor(){
        this.accessSecret = config.jwt.ACCESS_SECRET_KEY,
        this.accessExpireIn = config.jwt.ACCESS_EXPIRES_IN,

        this.refreshExpireIn = config.jwt.REFRESH_EXPIRES_IN,
        this.refreshSecret = config.jwt.REFRESH_SECRET_KEY
    }

    generateAccessToken(data: TJwtPayload): string {
        console.log(`Access secret ${this.accessSecret} and expires in ${this.accessExpireIn}`);
        console.log(`Refresh secret ${this.refreshSecret} and expires in ${this.refreshExpireIn}`);
        return jwt.sign(data , this.accessSecret , {expiresIn : this.accessExpireIn as ms.StringValue})
    }

    generateRefreshToken(data: TJwtPayload): string {
        return jwt.sign(data , this.refreshSecret , {expiresIn : this.refreshExpireIn as ms.StringValue})
    }

    verifyAccessToken(token: string): JwtPayload | null {
        console.log(`Access token for verification ${token} and access secret for verification ${this.accessSecret}`);
        return jwt.verify(token,this.accessSecret) as TJwtPayload
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        return jwt.verify(token , this.refreshSecret) as TJwtPayload
    }

    decodeRefreshToken(token: string): JwtPayload | null {
        console.log('token is here decodeRefreshService : ',token);
        const decode = jwt.decode(token) as JwtPayload
        console.log('-<<<<<<<<<<<<<<<<after decoding->>>>>>>>>>>>>>>>>>>>>');
        console.log(decode);
        return decode;
    }
}