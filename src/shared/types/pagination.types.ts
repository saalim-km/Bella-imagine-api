export interface PaginatedResult<T> {
  data: T[];
  total: number;
}