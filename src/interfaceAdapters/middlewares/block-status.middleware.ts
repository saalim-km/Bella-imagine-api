import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "./auth.middleware";
import { clearAuthCookies } from "../../shared/utils/cookie-helper.utils";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ZodError } from "zod";
import { CustomError } from "../../entities/utils/custom-error";
import { ClientModel } from "../../frameworks/database/models/client.model";
import { VendorModel } from "../../frameworks/database/models/vendor.model";

export const checkStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("in blockstatus check middleware");
    const user = req.user   
    console.log(user);

    if (user.role === "client") {
      console.log("user type is client");
      const client = await ClientModel.findById(user._id);
      console.log(client);
      if (client?.isblocked) {
        clearAuthCookies(res, "client_access_token", "client_refresh_token");
        res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ success: false, message: ERROR_MESSAGES.BLOCKED });
          return;
      }
    }

    if (user.role === "vendor") {
      console.log("user type is vendor");
      const vendor = await VendorModel.findById(user._id);
      console.log(vendor);
      if (vendor?.isblocked) {
        clearAuthCookies(res, "vendor_access_token", "vendor_refresh_token");
        res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ success: false, message: ERROR_MESSAGES.BLOCKED });
          return;
      }
    }

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((err) => ({
        message: err.message,
      }));
      console.log(errors);
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGES.VALIDATION_ERROR,
        errors,
      });
      return;
    }
    if (error instanceof CustomError) {
      console.log(error);
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    console.log(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
