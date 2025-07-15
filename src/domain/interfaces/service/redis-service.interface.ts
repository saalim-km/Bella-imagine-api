export interface IRedisService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expiry: number): Promise<void>;
  delete(key: string): Promise<void>;
  blacklistAccessToken(token: string, expiresAt: number): Promise<void>;
  isAccessTokenBlacklisted(token: string): Promise<boolean>;
}
