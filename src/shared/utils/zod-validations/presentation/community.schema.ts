import z from 'zod'
import { ImageSchema, limitQuerySchema, nameSchema, objectIdSchema, pageQuerySchema, searchQuerySchema, slugSchema } from '../validators/validations'

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
    title : z.string(),
    content : z.string().optional(),
    communityId : objectIdSchema,
    tags : z.preprocess(
        (val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string' && val.trim() !== '') return [val];
            return [];
        },
        z.array(z.string()).optional()
    ),
    mediaType : z.enum(['image','video','mixed','none']),
    media: z.preprocess(
        (val) => (Array.isArray(val) ? val : val ? [val] : []),
        z.array(z.custom<Express.Multer.File>()).optional()
    )
})