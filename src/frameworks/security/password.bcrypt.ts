import { injectable } from "tsyringe";
import { IBcrypt } from "./bcrypt.interface";
import bcrypt from 'bcrypt'

@injectable()
export class PasswordBcrypt implements IBcrypt {
   async  hash(original: string): Promise<string> {
        return await  bcrypt.hash(original,10)
    }

    async compare(current: string, original: string): Promise<boolean> {
        return bcrypt.compare(current , original)
    }
}