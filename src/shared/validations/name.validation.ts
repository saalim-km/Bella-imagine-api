import { z } from "zod";

export const nameSchema = z
  .string()
  .min(5, { message: "Name must be at least 6 characters long" })