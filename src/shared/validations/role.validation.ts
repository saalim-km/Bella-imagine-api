import { z } from "zod";

export const roleSchema = z.object({
    role: z.enum(["client", "admin", "vendor"])
});
