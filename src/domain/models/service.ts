import { ObjectId } from "mongoose";
import { DateSlot, SessionDuration } from "../../shared/types/service.types";

export interface IService {
  _id: ObjectId | string
  vendor: string | ObjectId
  serviceTitle: string;
  category: string | ObjectId;
  yearsOfExperience: number;
  styleSpecialty: string[];
  tags: string[];
  serviceDescription: string;
  sessionDurations: SessionDuration[];
  features: string[];
  availableDates: DateSlot[];
  location: Location;
  equipment: string[];
  cancellationPolicies: string[];
  termsAndConditions: string[];
  isPublished: boolean;
  createdAt ?: string;
  updatedAt ?: string;
}