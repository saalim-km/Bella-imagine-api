export interface IMarkMessagesAsReadUseCase {
  execute(
    chatRoomId: string,
    userId: string,
    userType: "Client" | "Vendor"
  ): Promise<void>;
}
