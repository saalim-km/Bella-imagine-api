import { Types } from "mongoose";



export interface IDepositRequired {
  amount: number;
  isPercentage: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
  isBooked: boolean
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


export interface IServiceFilter {
  serviceTitle?: string;
  category?: string; 
  location?: string;
  tags?: string[];
  styleSpecialty?: string[];
  isPublished?: boolean;
  createdAt?: 1 | -1;
  page ?: number;
  limit ?: number
}