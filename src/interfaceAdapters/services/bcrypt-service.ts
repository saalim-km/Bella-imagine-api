import { injectable } from "tsyringe";
import { IBcryptService } from "../../domain/interfaces/service/bcrypt-service.interface";
import bcrypt from "bcrypt";

@injectable()
export class BcryptService implements IBcryptService {
  async hash(original: string): Promise<string> {
    return await bcrypt.hash(original, 10);
  }

  async compare(current: string, original: string): Promise<boolean> {
    return bcrypt.compare(current, original);
  }
}
