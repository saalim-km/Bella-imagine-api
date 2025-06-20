import { Types } from "mongoose";
import {
  DateSlot,
  Location,
  SessionDuration,
} from "../../shared/types/service.types";

export interface IService {
  _id?: Types.ObjectId;
  vendor: Types.ObjectId;
  serviceTitle: string;
  category: Types.ObjectId;
  yearsOfExperience: number;
  styleSpecialty: string[];
  tags: string[];
  serviceDescription: string;
  sessionDurations: SessionDuration[];
  features: string[];
  availableDates: DateSlot[];
  location: Location;
  geoLocation?: {
    type: "Point";
    coordinates: number[];
  };
  equipment: string[];
  cancellationPolicies: string[];
  termsAndConditions: string[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}
