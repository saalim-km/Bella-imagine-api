export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface IEmailCheckResult<T> {
    success : boolean;
    data : T | null
}
export interface IDecoded {
    _id: string ; email : string ; role : string ; refreshToken : string
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}