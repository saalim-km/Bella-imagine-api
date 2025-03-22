export interface ISessionDuration {
  durationInMinutes: number;
  price: number;
}

export interface IAvailableDate {
  date: string;
  availableHours: {
    startTime: string;
    endTime: string;
  };
  bufferTime?: number;
  bookedSlots: IBookedSlot[];
}

export interface IBookedSlot {
  client: string;
  startTime: string;
  endTime: string;
  status?: "pending" | "confirmed" | "cancelled";
}

export interface ILocation {
  city?: string;
  state?: string;
  country?: string;
}

export interface IService {
  photographer: string;
  serviceName: string;
  description?: string;
  price: number;
  currency?: string;
  sessionDurations: ISessionDuration[];
  availableDates: IAvailableDate[];
  location?: ILocation;
  paymentRequired?: boolean;
  cancellationPolicy?: string;
}
