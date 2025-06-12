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

//  {
//   name: 'anilkk',
//   phoneNumber: '9895012661',
//   location: [Object: null prototype] {
//     address: 'Maradu, Ernakulam, Kochi, Kerala, India',
//     lat: '9.9367552',
//     lng: '76.3180429'
//   },
//   profileDescription: 'professional photographer',
//   portfolioWebsite: 'https://mywed.com',
//   languages: [ 'Bengali' ]
// } [Object: null prototype] {
//   profileImage: [
//     {
//       fieldname: 'profileImage',
//       originalname: 'unnamed (1).webp',
//       encoding: '7bit',
//       mimetype: 'image/webp',
//       destination: 'uploads/',
//       filename: '268d14db-fe4d-4abb-80cb-08adb559e80d-1749710167242.webp',
//       path: 'uploads\\268d14db-fe4d-4abb-80cb-08adb559e80d-1749710167242.webp',
//       size: 114300
//     }
//   ],
//   verificationDocument: [
//     {
//       fieldname: 'verificationDocument',
//       originalname: 'adhaar.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: 'uploads/',
//       filename: '65ad7995-bafb-46b7-a60b-f38045c89c6e-1749710167243.png',
//       path: 'uploads\\65ad7995-bafb-46b7-a60b-f38045c89c6e-1749710167243.png',
//       size: 101179
//     }
//   ]
// }

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