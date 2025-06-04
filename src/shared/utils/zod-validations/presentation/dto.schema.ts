import { z } from "zod";
import {Types} from 'mongoose'

import {
  searchQuerySchema,
  pageQuerySchema,
  limitQuerySchema,
  isBlockedQuerySchema,
  createdAtQuerySchema,
  roleSchema,
} from "../validators/validations";

export const getUsersQuerySchema = z.object({
  role: roleSchema,
  search: searchQuerySchema,
  page: pageQuerySchema,
  limit: limitQuerySchema,
  isblocked: isBlockedQuerySchema,
  createdAt: createdAtQuerySchema,
});

export const getVendorRequestsQuerySchema = z.object({
  search: searchQuerySchema,
  page: pageQuerySchema,
  limit: limitQuerySchema,
  createdAt: createdAtQuerySchema,
});

export const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .transform((val) => new Types.ObjectId(val));

export const getUserDetailsQuerySchema = z.object({
  id: objectIdSchema,
  role : roleSchema
});