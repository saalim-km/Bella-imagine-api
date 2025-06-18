import { z } from "zod";
import {
  limitQuerySchema,
  ImageSchema,
  nameSchema,
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


export const updateClientProfile = z.object({
  clientId : objectIdSchema,
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z
    .preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
      z.number().int().nonnegative().optional()
    ),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    lat: z.string().min(1, 'Latitude is required'),
    lng: z.string().min(1, 'Longitude is required'),
  }),
  profileImage: ImageSchema, 
  email: z.string().email('Invalid email address'),
});


export const updateVendorProfileSchema = z.object({
  vendorId : objectIdSchema,
  name : nameSchema,
  phoneNumber: z
    .preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
      z.number().int().nonnegative().optional()
    ),
      location: z.object({
    address: z.string().min(1, 'Address is required'),
  lat: z.preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z.number().min(1, 'Latitude is required')
  ),
  lng: z.preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z.number().min(1, 'Longitude is required')
  ),
  }),
  profileImage: ImageSchema, 
  verificationDocument : ImageSchema ,
  portfolioWebsite : z.string().optional(),
  profileDescription: z.string().optional(),
  languages : z.array(z.string().min(1, 'Language name cannot be empty')).optional(),
}) 



const BookingStatusEnum = z.enum(["all", "pending", "confirmed", "cancelled", "completed"]);


export const BookingQuerySchema = z.object({
  page: z
    .preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
      z.number().int().nonnegative().optional())
    .default(1)
    .describe("Page number for pagination"),
  limit: z
    .preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
      z.number().max(100).int().nonnegative().optional())
    .default(3)
    .describe("Number of bookings per page"),
  sort: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        [
          "createdAt",
          "-createdAt",
          "bookingDate",
          "-bookingDate",
          "totalPrice",
          "-totalPrice",
          "serviceDetails.serviceTitle",
          "-serviceDetails.serviceTitle",
          "vendorId.name",
          "-vendorId.name",
          "status",
          "-status",
        ].includes(value),
      {
        message:
          "Sort must be one of: createdAt, -createdAt, bookingDate, -bookingDate, totalPrice, -totalPrice, serviceDetails.serviceTitle, -serviceDetails.serviceTitle, vendorId.name, -vendorId.name, status, -status",
      }
    )
    .describe("Field to sort by, with optional descending order prefix (-)"),
  search: z
    .string()
    .max(100)
    .optional()
    .describe("Search term for booking title or vendor name"),
  statusFilter: BookingStatusEnum.default("all").describe("Filter by booking status"),
  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateFrom must be in YYYY-MM-DD format")
    .optional()
    .describe("Start date for booking date range filter"),
  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "dateTo must be in YYYY-MM-DD format")
    .optional()
    .describe("End date for booking date range filter"),
  priceMin: z
    .preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
      z.number().max(100000)
    )
    .default(0)
    .describe("Minimum price filter"),
  priceMax: z
    .preprocess(
      (val) => (typeof val === 'string' && val.trim() !== '' ? Number(val) : undefined),
      z.number().max(100000)
    )
    .default(100000)
    .describe("Maximum price filter"),
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo);
    }
    return true;
  },
  {
    message: "dateFrom must be before or equal to dateTo",
    path: ["dateTo"],
  }
);

export const  updateBookingSchema = z.object({
  bookingId : objectIdSchema,
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  userId : objectIdSchema,
})

export type BookingQueryParams = z.infer<typeof BookingQuerySchema>;

export const FetchAllCommunitiesSchema = z.object({
  page: pageQuerySchema,
  limit: limitQuerySchema,
  search: searchQuerySchema.optional(),
  category: objectIdSchema.optional(),
  membership: z.enum(['member', 'non-member']).optional(),
  sort: z
    .string()
    .optional()
    .transform((val) => {
      switch (val) {
        case "newest":
          return { createdAt: -1 } as Record<string, number>;
        case "oldest":
          return { createdAt: 1 } as Record<string, number>;
        case "name":
          return { name: 1 } as Record<string, number>;
        case "members":
          return { memberCount: -1 } as Record<string, number>;
        default:
          return undefined;
      }
    })
    .describe("Sort communities by: newest, oldest, name, or members")
    .optional(),
});


export const uploadMediaChat = z.object({
  media: z
    .any()
    .refine((file) => file && typeof file === "object" && "fieldname" in file && "originalname" in file, {
      message: "Media file is required and must be a valid file",
    })
    .transform((file) => file as Express.Multer.File),
  conversationId: z.string(),
});