import { emailSchema, nameSchema, otpSchema, passwordSchema, roleSchema } from "../validators/validations";
import { z } from "zod";

// Schema for client registration
const clientRegisterSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.literal("client"),
});

// Schema for vendor registration
const vendorRegisterSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.literal("vendor"),
});

// Combined user registration schemas based on role
export const userRegisterSchema = {
    client: clientRegisterSchema,
    vendor: vendorRegisterSchema,
};

export const sendOtpInputSchema = {
    email : emailSchema,
    role : roleSchema
}

// Schema for OTP verification
export const verifyOtpSchema = z.object({
    otp: otpSchema,
    email: emailSchema,
});


// Schema for Login user
export const userLoginSchema = z.object({
    email : emailSchema,
    password : passwordSchema,
    role : roleSchema
})

export const resetPasswordSchema = userLoginSchema;