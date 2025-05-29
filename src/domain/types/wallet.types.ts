import { IWallet } from "../models/wallet";

export type CreateWalletInput = Pick<IWallet, 'userType' | 'role' | 'userId'>;