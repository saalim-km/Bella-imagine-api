import { string, z } from "zod";
import {
  ImageSchema,
  limitQuerySchema,
  objectIdSchema,
  pageQuerySchema,
  parseBooleanSchema,
  searchQuerySchema,
} from "../validators/validations";
import { Types } from "mongoose";

// Schema for TimeSlot
const TimeSlotSchema = z.object({
  startTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Start time must be in HH:mm format (24-hour)"
    ),
  endTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "End time must be in HH:mm format (24-hour)"
    ),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, "Capacity must be at least 1")
  ),
  isBooked: z.boolean().default(false),
});

// Schema for DateSlot
const DateSlotSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine(
      (date) => new Date(date) > new Date("2025-06-17"),
      "Date must be in the future"
    ),
  timeSlots: z
    .array(TimeSlotSchema)
    .min(1, "At least one time slot is required"),
});

// Schema for SessionDuration
const SessionDurationSchema = z.object({
  durationInHours: z.preprocess(
    (val) => Number(val),
    z.number().positive("Duration must be greater than 0")
  ),
  price: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative("Price must be non-negative")
  ),
});

// Schema for Location
const LocationSchema = z.object({
  address: z.string().min(1, "Address is required").trim(),
  lat: z.number().finite("Latitude must be a valid number"),
  lng: z.number().finite("Longitude must be a valid number"),
});

// Schema for IService (create service)
export const CreateServiceSchema = z
  .object({
    serviceTitle: z.string().min(1, "Service title is required").trim(),
    category: objectIdSchema,
    yearsOfExperience: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .int()
        .min(0, "Years of experience must be non-negative")
        .max(100, "Years of experience cannot exceed 100")
    ),
    styleSpecialty: z
      .array(z.string().min(1, "Style specialty cannot be empty").trim())
      .min(1, "At least one style specialty is required"),
    tags: z
      .array(z.string().min(1, "Tag cannot be empty").trim())
      .min(1, "At least one tag is required"),
    serviceDescription: z
      .string()
      .min(1, "Service description is required")
      .trim(),
    sessionDurations: z
      .array(SessionDurationSchema)
      .min(1, "At least one session duration is required"),
    features: z
      .array(z.string().min(1, "Feature cannot be empty").trim())
      .min(1, "At least one feature is required"),
    availableDates: z
      .array(DateSlotSchema)
      .min(2, "At least two future dates are required"),
    location: LocationSchema,
    equipment: z
      .array(z.string().min(1, "Equipment cannot be empty").trim())
      .min(1, "At least one equipment is required"),
    cancellationPolicies: z
      .array(z.string().min(1, "Cancellation policy cannot be empty").trim())
      .min(1, "At least one cancellation policy is required"),
    termsAndConditions: z
      .array(z.string().min(1, "Term cannot be empty").trim())
      .min(1, "At least one term is required"),
    isPublished: z.boolean().default(true),
  })
  .strict();

export const getSeviceSchema = z.object({
  serviceTitle: searchQuerySchema,
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
  page: pageQuerySchema,
  limit: limitQuerySchema,
});

export const updateServiceSchema = CreateServiceSchema.extend({
  _id: objectIdSchema,
  __v: z.number().optional(),
  vendor: objectIdSchema.optional(),
}).passthrough();

export const createWorkSampleSchema = z.object({
  service: objectIdSchema,
  vendor: objectIdSchema,
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string().min(2, "Tag cannot be empty").trim()),
  description: z.string().min(1, "Description is required"),
  isPublished: parseBooleanSchema,
  media: z.preprocess(
    (val) => (Array.isArray(val) ? val : val ? [val] : []),
    z
      .array(z.custom<Express.Multer.File>())
      .min(1, "At least one media file is required")
  ),
});

export const updateWorkSampleSchema = createWorkSampleSchema
  .omit({ media: true }) // omit old media field
  .extend({
    _id: objectIdSchema,
    existingImageKeys: z.array(z.string()).default([]),
    deletedImageKeys: z.array(z.string()).default([]),
    newImages: z.preprocess(
      (val) => (Array.isArray(val) ? val : val ? [val] : []),
      z.array(z.custom<Express.Multer.File>()).optional()
    ),
  });

export const getWorkSamplesSchema = z.object({
  limit: limitQuerySchema,
  title: searchQuerySchema,
  service: z
    .string()
    .transform((val) => (val ? new Types.ObjectId(val) : undefined))
    .refine(
      (val) => val === undefined || Types.ObjectId.isValid(val.toString()),
      {
        message: "Invalid ObjectId",
      }
    )
    .optional(),
  page: pageQuerySchema,
  isPublished: z
    .string()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return undefined;
    })
    .optional(),
});
