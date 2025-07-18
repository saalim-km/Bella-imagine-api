import z from "zod";
import {
  ImageSchema,
  limitQuerySchema,
  nameSchema,
  objectIdSchema,
  pageQuerySchema,
  searchQuerySchema,
  slugSchema,
} from "../validators/validations";

export const createCommunitySchema = z.object({
  name: nameSchema,
  description: z.string(),
  category: objectIdSchema,
  rules: z.array(z.string()),
  isPrivate: z.preprocess((val) => val === "true" || val === true, z.boolean()),
  isFeatured: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ),
  iconImage: ImageSchema,
  coverImage: ImageSchema,
});

export const fetchCommunitySchema = z.object({
  page: pageQuerySchema,
  limit: limitQuerySchema,
  search: searchQuerySchema,
});

export const fetchCommBySlugSchema = z.object({
  slug: slugSchema,
  userId: objectIdSchema,
});

export const updateCommuitySchema = z.object({
  _id: objectIdSchema,
  name: z.string(),
  description: z.string(),
  category: objectIdSchema,
  rules: z.array(z.string()),
  coverImage: ImageSchema,
  iconImage: ImageSchema,
  isPrivate: z.preprocess((val) => val === "true" || val === true, z.boolean()),
  isFeatured: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean()
  ),
});

export const createPostSchema = z.object({
  userId: objectIdSchema,
  role: z.preprocess((val) => {
    if (val === "client") return "Client";
    if (val === "vendor") return "Vendor";
    return val;
  }, z.enum(["Client", "Vendor"])),
  title: z.string(),
  content: z.string().optional(),
  communityId: objectIdSchema,
  tags: z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.trim() !== "") return [val];
    return [];
  }, z.array(z.string()).optional()),
  mediaType: z.enum(["image", "video", "mixed", "none"]),
  media: z.preprocess(
    (val) => (Array.isArray(val) ? val : val ? [val] : []),
    z.array(z.custom<Express.Multer.File>()).optional()
  ),
});

export const getAllPostSchema = z.object({
  page: pageQuerySchema,
  limit: limitQuerySchema,
  communityId: z.preprocess(
    (val) => (val ? val : undefined),
    objectIdSchema.optional()
  ),
});

export const getPostDetailsSchema = z.object({
  userId: objectIdSchema,
  postId: objectIdSchema,
  page: pageQuerySchema,
  limit: limitQuerySchema,
});

export const addCommentSchema = z.object({
  postId: objectIdSchema,
  content: z.string(),
  userId: objectIdSchema,
});

export const getCommentsSchema = z.object({
  limit: limitQuerySchema,
  page: pageQuerySchema,
  userId: objectIdSchema,
});

export const editCommentSchema = z.object({
  commentId: objectIdSchema,
  content: z.string(),
});

export const getPostsSchema = z.object({
  limit: limitQuerySchema,
  page: pageQuerySchema,
  userId: objectIdSchema,
});

export const editPostSchema = z.object({
  _id: objectIdSchema,
  tags: z.array(z.string()).optional().default([]),
  title: z.string().min(1, "title is required"),
  content: z.string().min(1, "content is required"),
  existingImageKeys: z.array(z.string()).default([]),
  deletedImageKeys: z.array(z.string()).default([]),
  newImages: z.preprocess(
    (val) => {
      // Handle the case where val is an object with 'newImages[]' property
      if (val && typeof val === 'object' && 'newImages[]' in val) {
        return val['newImages[]'] || [];
      }
      // Handle the case where val is already an array
      if (Array.isArray(val)) {
        return val;
      }
      return [];
    },
    z.array(z.custom<Express.Multer.File>()).optional()
  ),
});