import { z } from "zod";
import { emailSchema } from "../../../../shared/validations/email.validation";
import { passwordSchema } from "../../../../shared/validations/password.validation";

export const loginSchema = z.object({
    email : emailSchema,
    password : passwordSchema,
})