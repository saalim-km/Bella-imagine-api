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
  travelFee ?: number;
  lat : number,
  lng : number,
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