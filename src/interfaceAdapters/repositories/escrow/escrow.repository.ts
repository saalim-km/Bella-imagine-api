import { IEscrowEntity } from "../../../entities/models/escrow.entity";
import { IEscrowRepository } from "../../../entities/repositoryInterfaces/escrow/escrow-repository.interface";
import { escrowModel } from "../../../frameworks/database/models/escrow.model";

export class EscrowRepository implements IEscrowRepository {
    async create(escrowData: Partial<IEscrowEntity>): Promise<IEscrowEntity> {
      return await escrowModel.create(escrowData)
    }
  
    async findById(id: string): Promise<IEscrowEntity | null> {
      return await escrowModel.findById(id)
        .populate('booking')
        .populate('payment')
        .populate('client')
        .populate('vendor');
    }
  
    async update(id: string, escrowData: Partial<IEscrowEntity>): Promise<IEscrowEntity | null> {
      return await escrowModel.findByIdAndUpdate(id, escrowData, { new: true });
    }
  
    async getClientEscrows(clientId: string): Promise<IEscrowEntity[]> {
      return await escrowModel.find({ client: clientId })
        .sort({ createdAt: -1 })
        .populate('booking')
        .populate('payment')
        .populate('vendor');
    }
  
    async getVendorEscrows(vendorId: string): Promise<IEscrowEntity[]> {
      return await escrowModel.find({ vendor: vendorId })
        .sort({ createdAt: -1 })
        .populate('booking')
        .populate('payment')
        .populate('client');
    }
  
    async getEscrowsByStatus(status: string): Promise<IEscrowEntity[]> {
      return await escrowModel.find({ status })
        .sort({ createdAt: -1 })
        .populate('booking')
        .populate('payment')
        .populate('client')
        .populate('vendor');
    }
  }
  