import { z } from "zod";
import { emailSchema } from "../../../../shared/validations/email.validation";
import { passwordSchema } from "../../../../shared/validations/password.validation";
import { roleSchema } from "../../../../shared/validations/role.validation";

 const adminSchema = z.object({
    email : emailSchema,
    password : passwordSchema,
    role : z.literal("admin")
})

 const clientSchema = z.object({
    email : emailSchema,
    password : passwordSchema,
    role : z.literal("client")
})

const vendorSchema = z.object({
    email : emailSchema,
    password : passwordSchema,
    role : z.literal("vendor")
})

export const userLoginSchema = {
    admin : adminSchema,
    client : clientSchema,
    vendor : vendorSchema
}