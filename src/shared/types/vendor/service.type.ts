import { Types } from "mongoose";



export interface IDepositRequired {
  amount: number;
  isPercentage: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

export interface SessionDuration {
  durationInHours: number;
  price: number;
}

export interface RecurringAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CustomField {
  name: string;
  type: string;
  required: boolean;
  options: string[];
}

export interface Location {
  options: {
    studio: boolean;
    onLocation: boolean;
  };
  travelFee: number;
  city: string;
  state: string;
  country: string;
}

// Interface for query filters
export interface IServiceFilter {
  vendor?: Types.ObjectId | string;
  category?: Types.ObjectId | string;
  serviceName?: string;
  tags?: string[];
  isPublished?: boolean;
  minPrice?: number;
  maxPrice?: number;
}