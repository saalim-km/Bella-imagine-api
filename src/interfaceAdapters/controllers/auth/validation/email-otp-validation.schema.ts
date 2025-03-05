import { z } from "zod";
import { emailSchema } from "../../../../shared/validations/email.validation";
import { otpSchema } from "../../../../shared/validations/otp.validation";

export const emailOtpVerifySchema = z.object({
    email : emailSchema,
    otp : otpSchema
})