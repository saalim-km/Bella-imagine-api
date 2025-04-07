import { Document, model } from "mongoose";
import { IEscrowEntity } from "../../../entities/models/escrow.entity";
import { escrowSchema } from "../schemas/escrow.schema";

export interface IEscrowModel extends IEscrowEntity {}

export const escrowModel = model('Escrow',escrowSchema)