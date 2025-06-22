import { Types } from "mongoose"

export type TNotificationType = 'booking' | 'chat' | 'contest' | 'review' | 'system' | 'custom'

export interface INotification {
    _id: Types.ObjectId
    type: TNotificationType
    message: string
    isRead ?: boolean
    receiverId: Types.ObjectId
    receiverModel ?: 'Client' | 'Vendor' 
    senderModel ?: 'Client' | 'Vendor' 
    senderId: Types.ObjectId
    actionUrl?: string
    meta?: Record<string, any>
    readAt?: string
    createdAt?: string
    updatedAt?: string
}