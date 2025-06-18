export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
  isBooked: boolean;
}

export interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

export interface SessionDuration {
  durationInHours: number;
  price: number;
}

export interface Location {
  address : string;
  lat: number;
  lng: number;
  travelFee?: number;
}

export type TComment = {
    user: string;
    text: string;
    createdAt: Date;
}
