export interface IMarkMessageAsReadUsecase {
    execute(messageId : string) : Promise<void  >
}