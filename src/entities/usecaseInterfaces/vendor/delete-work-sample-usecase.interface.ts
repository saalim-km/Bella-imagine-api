export interface IDeleteWorkSampleUsecase {
    execute(workSampleId : string) : Promise<void>
}