import z, { string } from 'zod'
import { ImageSchema, limitQuerySchema, nameSchema, objectIdSchema, pageQuerySchema, roleSchema, searchQuerySchema, slugSchema } from '../validators/validations'

export const createCommunitySchema = z.object({
    name: nameSchema,
    description: z.string(),
    category : objectIdSchema,
    rules: z.array(z.string()),
    isPrivate: z.preprocess(
        (val) => val === 'true' || val === true,
        z.boolean()
    ),
    isFeatured: z.preprocess(
        (val) => val === 'true' || val === true,
        z.boolean()
    ),
    iconImage: ImageSchema,
    coverImage: ImageSchema
})

export const fetchCommunitySchema = z.object({
    page : pageQuerySchema,
    limit : limitQuerySchema,
    search : searchQuerySchema
})


export const fetchCommBySlugSchema = z.object({
    slug : slugSchema,
    userId : objectIdSchema
})

export const updateCommuitySchema = z.object({
    _id: objectIdSchema,
    name: z.string(),
    description: z.string(),
    category : objectIdSchema,
    rules: z.array(z.string()),
    coverImage: ImageSchema,
    iconImage: ImageSchema,
    isPrivate: z.preprocess(
        (val) => val === 'true' || val === true,
        z.boolean()
    ),
    isFeatured: z.preprocess(
        (val) => val === 'true' || val === true,
        z.boolean()
    ),
})

export const createPostSchema = z.object({
    userId: objectIdSchema,
    role: z.preprocess(
        (val) => {
            if (val === 'client') return 'Client';
            if (val === 'vendor') return 'Vendor';
            return val;
        },
        z.enum(['Client', 'Vendor'])
    ),
    title: z.string(),
    content: z.string().optional(),
    communityId: objectIdSchema,
    tags: z.preprocess(
        (val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string' && val.trim() !== '') return [val];
            return [];
        },
        z.array(z.string()).optional()
    ),
    mediaType: z.enum(['image', 'video', 'mixed', 'none']),
    media: z.preprocess(
        (val) => (Array.isArray(val) ? val : val ? [val] : []),
        z.array(z.custom<Express.Multer.File>()).optional()
    )
})

export const getAllPostSchema = z.object({
    page: pageQuerySchema,
    limit: limitQuerySchema,
    communityId: z.preprocess(
        (val) => (val ? val : undefined),
        objectIdSchema.optional()
    )
})

export const getPostDetailsSchema = z.object({
    userId : objectIdSchema,
    postId: objectIdSchema,
    page : pageQuerySchema,
    limit : limitQuerySchema
})

export const addCommentSchema = z.object({
    postId : objectIdSchema,
    content : z.string(),
    userId : objectIdSchema
})

export const getCommentsSchema = z.object({
    limit : limitQuerySchema,
    page : pageQuerySchema,
    userId : objectIdSchema,
})