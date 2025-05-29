import { emailSchema, nameSchema, passwordSchema } from "./validations"
import { z } from "zod";

const clienRegistertSchema = z.object({
    name : nameSchema,
    email : emailSchema,
    password : passwordSchema,
    role : z.literal("client")
})

const vendorRegisterSchema = z.object({
    name : nameSchema,
    email : emailSchema,
    password : passwordSchema,
    role : z.literal("vendor")
})

export const userRegisterSchema = {
    client : clienRegistertSchema,
    vendor : vendorRegisterSchema,
}