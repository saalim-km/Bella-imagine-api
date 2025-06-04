import { z } from "zod";

export const nameSchema = z
  .string()
  .min(5, { message: "Name must be at least 5 characters long" });

export const emailSchema = z
  .string()
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Invalid email format",
  });

export const otpSchema = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only numbers");

export const phoneNumberSchema = z
  .string()
  .length(10, { message: "Phone number must be exactly 10 digits" })
  .regex(/^\d{10}$/, { message: "Phone number must contain only digits" });


export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one digit" })
  .regex(/[@$!%*?&]/, {
    message: "Password must contain at least one special character",
  });






export const searchQuerySchema = z.string().optional();

export const pageQuerySchema = z
  .string()
  .regex(/^\d+$/, { message: "Page must be a number" })
  .transform(Number)
  .refine((val) => val > 0, { message: "Page must be greater than 0" });

export const limitQuerySchema = z
  .string()
  .regex(/^\d+$/, { message: "Limit must be a number" })
  .transform(Number)
  .refine((val) => val > 0, { message: "Limit must be greater than 0" });

export const isBlockedQuerySchema = z
  .string()
  .transform((val) => val === "true")
  .optional();

export const createdAtQuerySchema = z
  .string()
  .regex(/^\d+$/, { message: "createdAt must be a number" })
  .transform(Number)
  .optional();
