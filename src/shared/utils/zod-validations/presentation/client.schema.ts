import { z } from "zod";
import {
  limitQuerySchema,
  objectIdSchema,
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


export const createBookingSchema = z.object({
  bookingDate: z.string().min(1, "Booking date is required"),
  serviceId: objectIdSchema,
  vendorId: objectIdSchema,
  clientId : objectIdSchema,

  timeSlot: z.object({
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
  }),

  totalPrice: z.number().min(0, "Total price must be positive"),

  location: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),

  purpose: z.enum(['vendor-booking']),
  createrType: z.enum(['Client', 'Vendor']),
  receiverType: z.enum(['Client', 'Vendor']),

  // Optional fields
  distance: z.number().optional(),
  customLocation: z.string().optional(),
  travelFee: z.number().optional(),
  travelTime: z.string().optional(),
});