import z from 'zod'
import { ImageSchema, limitQuerySchema, nameSchema, objectIdSchema, pageQuerySchema, searchQuerySchema, slugSchema } from '../validators/validations'

export const createCommunitySchema = z.object({
    name: nameSchema,
    description: z.string(),
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