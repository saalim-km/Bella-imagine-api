export interface CreateCommunityDto {
  name: string;
  description: string;
  rules: string[];
  isPrivate: boolean;
  isFeatured: boolean;
  files?: {
    iconImage?: Express.Multer.File;
    coverImage?: Express.Multer.File;
  };
}
export interface UpdateCommunityDto {
  _id : string;
  name: string;
  slug : string;
  description: string;
  rules: string[];
  isPrivate: boolean;
  isFeatured: boolean;
  files?: {
    iconImage?: Express.Multer.File;
    coverImage?: Express.Multer.File;
  };
}
