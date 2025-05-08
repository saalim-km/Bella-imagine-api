export interface IUploadMediaChatUsecase {
    execute(file : Express.Multer.File , conversationId : string) : Promise<{key : string , mediaUrl: string}>
}