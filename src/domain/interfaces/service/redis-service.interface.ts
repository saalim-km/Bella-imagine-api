export interface IRedisService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string , expiry : number): Promise<void>;
  delete(key: string): Promise<void>;
}