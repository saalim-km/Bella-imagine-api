import { IEscrowEntity } from "../../models/escrow.entity";

export interface IEscrowRepository {
  create(escrowData: Partial<IEscrowEntity>): Promise<IEscrowEntity>;
  findById(id: string): Promise<IEscrowEntity | null>;
  update(
    id: string,
    escrowData: Partial<IEscrowEntity>
  ): Promise<IEscrowEntity | null>;
  getClientEscrows(clientId: string): Promise<IEscrowEntity[]>;
  getVendorEscrows(vendorId: string): Promise<IEscrowEntity[]>;
  getEscrowsByStatus(status: string): Promise<IEscrowEntity[]>;
}
