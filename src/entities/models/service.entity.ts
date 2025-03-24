import { ObjectId } from "mongoose";
import { DateSlot, IDepositRequired , SessionDuration , RecurringAvailability , CustomField , Location} from "../../shared/types/vendor/service.type";

export interface IServiceEntity {
  _id ?: string;
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
  customFields: CustomField[];
  isPublished?: boolean;
  portfolioImages: string[];
  createdAt ?: string;
  updatedAt ?: string;
}