import { IWorkSampleEntity } from "../../models/work-sample.entity";

export interface IUpdateWorkSampleUsecase {
    execute(workSampleId : string , payload : Partial<IWorkSampleEntity>): Promise<void>
}