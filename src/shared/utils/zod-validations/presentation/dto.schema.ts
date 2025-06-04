import { z } from "zod";
import {
  searchQuerySchema,
  pageQuerySchema,
  limitQuerySchema,
  isBlockedQuerySchema,
  createdAtQuerySchema,
} from "../validators/validations";

export const getUsersQuerySchema = z.object({
  role: z.enum(["client","vendor","admin"]),
  search: searchQuerySchema,
  page: pageQuerySchema,
  limit: limitQuerySchema,
  isblocked: isBlockedQuerySchema,
  createdAt: createdAtQuerySchema,
});
