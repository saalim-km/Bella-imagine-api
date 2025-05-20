import { ObjectId } from "mongoose";
import { DateSlot , SessionDuration , RecurringAvailability , Location} from "../../shared/types/vendor/service.type";

export interface IServiceEntity {
  _id ?: ObjectId | string
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
  isPublished?: boolean;
  createdAt ?: string;
  updatedAt ?: string;
}