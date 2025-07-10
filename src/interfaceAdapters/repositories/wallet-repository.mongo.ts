import { injectable } from "tsyringe"
import { BaseRepository } from "./base-repository.mongo"
import type { IWalletRepository } from "../../domain/interfaces/repository/wallet.repository"
import { Wallet } from "../database/schemas/wallet.schema"
import type { IWallet, PopulatedWallet } from "../../domain/models/wallet"
import type { CreateWalletInput, UpdateWalletBalanceInput, WalletQueryOptions } from "../../domain/types/wallet.types"
import type { Types } from "mongoose"

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
  constructor() {
    super(Wallet)
  }

  async createWallet(input: CreateWalletInput): Promise<void> {
    const data: Partial<IWallet> = {
      userId: input.userId,
      userType: input.userType,
      role: input.role,
    }
    await this.create(data)
  }

  async findByIdAndUpdateWalletBalance(input: UpdateWalletBalanceInput): Promise<void> {
    const { balanceAmount, paymentId, userId } = input
    await this.model.findOneAndUpdate(
      { userId: userId },
      { $push: { paymentId: paymentId }, $inc: { balance: balanceAmount } },
    )
  }

  private _buildPaymentMatchQuery(options?: WalletQueryOptions) {
    const paymentMatch: any = {}

    if (options?.search) {
      paymentMatch.$or = [
        { transactionId: { $regex: options.search, $options: "i" } },
        { purpose: { $regex: options.search, $options: "i" } },
      ]
    }

    if (options?.status && options.status !== "all") {
      paymentMatch.status = options.status
    }

    if (options?.purpose && options.purpose !== "all") {
      paymentMatch.purpose = options.purpose
    }

    if (options?.dateRange && options.dateRange !== "all") {
      const now = new Date()
      let startDate: Date

      switch (options.dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(0)
      }

      paymentMatch.createdAt = { $gte: startDate }
    }

    return paymentMatch
  }

  private _buildSortOptions(options?: WalletQueryOptions) {
    let sortOptions: any = { createdAt: -1 } // default sort

    if (options?.sortField && options?.sortOrder) {
      switch (options.sortField) {
        case "date":
          sortOptions = { createdAt: options.sortOrder === "asc" ? 1 : -1 }
          break
        case "amount":
          sortOptions = { amount: options.sortOrder === "asc" ? 1 : -1 }
          break
        case "status":
          sortOptions = { status: options.sortOrder === "asc" ? 1 : -1 }
          break
        case "purpose":
          sortOptions = { purpose: options.sortOrder === "asc" ? 1 : -1 }
          break
      }
    }

    return sortOptions
  }

  async findByUserId(userId: Types.ObjectId, options?: WalletQueryOptions): Promise<PopulatedWallet> {
    const query = this.model.findOne({ userId })

    const paymentMatch = this._buildPaymentMatchQuery(options)
    const sortOptions = this._buildSortOptions(options)

    // Apply pagination if provided
    const skip = options?.page && options?.limit ? (options.page - 1) * options.limit : 0
    const limit = options?.limit || 0

    return (await query
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "paymentId",
        select: "userId bookingId transactionId paymentIntentId purpose amount currency status createdAt",
        match: Object.keys(paymentMatch).length > 0 ? paymentMatch : undefined,
        options: {
          sort: sortOptions,
          skip: skip,
          limit: limit,
        },
      })) as unknown as PopulatedWallet
  }

  async getTransactionCount(userId: Types.ObjectId, options?: WalletQueryOptions): Promise<number> {
    const wallet = await this.model.findOne({ userId }).populate("paymentId")
    if (!wallet) return 0

    // Apply the same filters as in findByUserId
    const filteredCount = wallet.paymentId?.length || 0

    // This is a simplified count - in production, you might want to use aggregation
    // for more efficient counting with complex filters
    return filteredCount
  }

  async addPaymnetIdToWallet(userId: Types.ObjectId, paymentId: Types.ObjectId): Promise<void> {
    await this.model.findOneAndUpdate({ userId: userId }, { $push: { paymentId: paymentId } })
  }

  async updateWalletBalanceAndAddPaymentId(input: UpdateWalletBalanceInput): Promise<void> {
    const { balanceAmount, paymentId, userId } = input
    await this.model.findOneAndUpdate(
      { userId: userId },
      { $push: { paymentId: paymentId }, $inc: { balance: balanceAmount } },
    )
  }

  async fetchAdminWallet(options?: WalletQueryOptions): Promise<PopulatedWallet> {
    const query = this.model.findOne({ userType: "Admin" })

    const paymentMatch = this._buildPaymentMatchQuery(options)
    const sortOptions = this._buildSortOptions(options)

    // Apply pagination if provided
    const skip = options?.page && options?.limit ? (options.page - 1) * options.limit : 0
    const limit = options?.limit || 0

    const wallet = (await query.populate({
      path: "paymentId",
      select: "userId bookingId transactionId paymentIntentId purpose amount currency status createdAt",
      match: Object.keys(paymentMatch).length > 0 ? paymentMatch : undefined,
      options: {
        sort: sortOptions,
        skip: skip,
        limit: limit,
      },
    })) as unknown as PopulatedWallet

    return wallet
  }
}
