import { z } from "zod";

import {
  searchQuerySchema,
  pageQuerySchema,
  limitQuerySchema,
  isBlockedQuerySchema,
  createdAtQuerySchema,
  roleSchema,
  parseBooleanSchema,
  statusQuerySchema,
  objectIdSchema,
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


export const getUserDetailsQuerySchema = z.object({
  id: objectIdSchema,
  role : roleSchema
});

export const updateUserBlockStatusSchema = z.object({
  id: objectIdSchema,
  role: roleSchema,
  isblocked: parseBooleanSchema
})

export const updateVendorRequestSchema = z.object({
  id : objectIdSchema,
  reason : z.string().optional(),
  status : parseBooleanSchema,
})

export const getCategoriesSchema = z.object({
  search : searchQuerySchema,
  page : pageQuerySchema,
  limit : limitQuerySchema,
  status : statusQuerySchema
})


export const createCategorySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .regex(/^[A-Za-z\s]+$/, "Title can only contain letters and spaces"),
  status: parseBooleanSchema,
});

export const getCatJoinRequestsSchema = z.object({
  limit : limitQuerySchema,
  page : pageQuerySchema
})

export const updateCategorySchema = z.object({
  id : objectIdSchema,
})

export const getCommunityMemberSchema = z.object({
  limit : limitQuerySchema,
  page : pageQuerySchema
})