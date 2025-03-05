import { z } from "zod";

export const locationSchema = z
  .string()
  .min(2, { message: "Location must be at least 2 characters long" }) 
  .max(50, { message: "Location must be at most 50 characters long" }) 
  .regex(/^[A-Za-z\s]+$/, { message: "Location must contain only alphabets and spaces" }); 
