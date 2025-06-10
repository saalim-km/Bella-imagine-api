import { z } from "zod";
import {
  limitQuerySchema,
  pageQuerySchema,
  searchQuerySchema,
} from "../validators/validations";
import { Types } from "mongoose";

export const getVendorsSchema = z.object({
  page: pageQuerySchema,
  limit: limitQuerySchema,
  category: z
    .string()
    .transform((val) => (val ? new Types.ObjectId(val) : undefined))
    .refine(
      (val) => val === undefined || Types.ObjectId.isValid(val.toString()),
      {
        message: "Invalid ObjectId",
      }
    )
    .optional(),
  languages: searchQuerySchema,
});


export const getVendorDetailsSchema = z.object({
  serviceLimit : limitQuerySchema,
  sampleLimit : limitQuerySchema,
  samplePage : pageQuerySchema,
  servicePage : pageQuerySchema 
})