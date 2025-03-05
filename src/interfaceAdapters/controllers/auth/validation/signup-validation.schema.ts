import { z } from "zod";
import { emailSchema } from "../../../../shared/validations/email.validation";
import { passwordSchema } from "../../../../shared/validations/password.validation"; 
import { nameSchema } from "../../../../shared/validations/name.validation";
import { locationSchema } from "../../../../shared/validations/location.validation";

const clientSchema = z.object({
    name : nameSchema,
    email : emailSchema,
    password : passwordSchema,
    role : z.literal("client")
})

const vendorSchema = z.object({
    name : nameSchema,
    email : emailSchema,
    password : passwordSchema,
    role : z.literal("vendor")
})

export const userSchema = {
    client : clientSchema,
    vendor : vendorSchema,
}