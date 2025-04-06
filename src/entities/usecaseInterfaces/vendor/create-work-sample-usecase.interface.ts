import { IWorkSampleEntity } from "../../models/work-sample.entity";

export interface ICreateWorkSampleUsecase {
    execute(data : Partial<IWorkSampleEntity> , vndorId : string) : Promise<void>
}