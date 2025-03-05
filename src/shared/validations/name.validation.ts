import { z } from "zod";

export const nameSchema = z
  .string()
  .min(5, { message: "Name must be at least 6 characters long" })
  .regex(/^[a-zA-Z]+$/, {
    message: "Name must contain only alphabetic characters",
});
