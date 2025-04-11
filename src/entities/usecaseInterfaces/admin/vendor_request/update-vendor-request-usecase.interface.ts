export interface IUpdateVendorRequestUsecase {
    execute(senderId : string, receiverId : string , status : 'reject' | 'accept'  , rejectReason ?: string) : Promise<void>
}