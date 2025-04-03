export type TMedia = {
    url: string;
    type: "image" | "video";
}

export type TComment = {
    user: string;
    text: string;
    createdAt: Date;
}



export interface IWorkSampleFilter {
    title?: string;
    service?: string; 
    tags?: string[];
    isPublished?: boolean;
    createdAt?: 1 | -1;
    page ?: number;
    limit ?: number
}

export interface IWorkSampleUpdateRequest {
    _id ?: string;
    service: string;
    vendor : string;
    title: string;
    description: string;
    media: TMedia[];
    tags?: string[];
    likes?: string[];
    comments?: TComment;
    isPublished: boolean;
}