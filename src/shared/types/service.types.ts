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
  travelFee?: number;
  lat: number;
  lng: number;
}


export type TMedia = {
    url: string;
    type: "image" | "video";
}

export type TComment = {
    user: string;
    text: string;
    createdAt: Date;
}
