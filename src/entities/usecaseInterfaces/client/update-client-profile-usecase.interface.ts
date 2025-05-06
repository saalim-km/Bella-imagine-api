import { UpdateClientDto } from "../../../shared/dtos/user.dto";

export interface IUpdateClientUsecase {
    excute(id: string, data: UpdateClientDto, file?: Express.Multer.File) : Promise<void>
}