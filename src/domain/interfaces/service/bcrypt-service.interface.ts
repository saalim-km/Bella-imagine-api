export interface IBcryptService {
  hash(original: string): Promise<string>;
  compare(current: string, original: string): Promise<boolean>;
}
