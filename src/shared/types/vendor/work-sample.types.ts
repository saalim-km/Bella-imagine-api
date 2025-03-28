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