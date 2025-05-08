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
