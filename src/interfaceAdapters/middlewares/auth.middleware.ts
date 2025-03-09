import { Request , Response , NextFunction } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { JwtService } from "../services/jwt.service";
import { JwtPayload } from "jsonwebtoken";

const tokenService = new JwtService();


export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
  role: string;
  access_token: string;
  refresh_token: string;
}

export interface CustomRequest extends Request {
  user: CustomJwtPayload;
}



const extractToken = (
    req: Request
  ): { access_token: string; refresh_token: string } | null => {
    const pathSegments = req.path.split("/");
    console.log(pathSegments);
    const privateRouteIndex = pathSegments.indexOf("");
    console.log(privateRouteIndex);
  
    if (privateRouteIndex !== -1 && pathSegments[privateRouteIndex + 1]) {
      const userType = pathSegments[privateRouteIndex + 1];
      return {
        access_token: req.cookies[`${userType}_access_token`] || null,
        refresh_token: req.cookies[`${userType}_refresh_token`] || null,
      };
    }
  
    return null;
};




export const verifyAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        console.log('-<<<<<<<<<<<<<<< in verifyauth middleware->>>>>>>>>>>>>>>');
      const token = extractToken(req);
        console.log(token);

      if (!token) {
        console.log("no token");
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
        return;
      }
  
      console.log('---------------after checking tokens-----------------');
    //->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // Currently not doint the blcaklisting of tokens , redis is not currently set.
    //   if (await isBlacklisted(token.access_token)) {
    //     console.log("token is black listed is worked");
    //     res
    //       .status(HTTP_STATUS.FORBIDDEN)
    //       .json({ message: "Token is blacklisted" });
    //     return;
    //   }
  

      const user = tokenService.verifyAccessToken(
        token.access_token
      ) as CustomJwtPayload;

      console.log(user);
      console.log(`-------------------after verifying access token-------------------`);
      if (!user || !user._id) {
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
        return;
      }
  
      console.log('-----------------------after checking access token---------------------------');
      (req as CustomRequest).user = {
        ...user,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };

      console.log('calling next function');
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        console.log("token is expired is worked");
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: ERROR_MESSAGES.TOKEN_EXPIRED });
        return;
      }
      console.log("token is invalid is worked");
  
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: ERROR_MESSAGES.INVALID_TOKEN });
      return;
    }
  };








  export const decodeToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = extractToken(req);

      if (!token) {
        console.log("no token");
        res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
        return;
      }

      // if (await isBlacklisted(token.access_token)) {
      //   console.log("token is black listed is worked");
      //   res
      //     .status(HTTP_STATUS.FORBIDDEN)
      //     .json({ message: "Token is blacklisted" });
      //   return;
      // }
  
      const user = tokenService.decodeRefreshToken(token?.access_token);
      console.log("decoded", user);
      (req as CustomRequest).user = {
        _id: user?._id,
        email: user?.email,
        role: user?.role,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      };
      next();
    } catch (error) {}
  };