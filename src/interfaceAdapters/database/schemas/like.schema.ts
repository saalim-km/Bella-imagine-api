import { model, Schema } from "mongoose"
import type { ILike } from "../../../domain/models/community"

const likeSchema = new Schema<ILike>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
      index: true, // Add index for better query performance
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true, // Add index for better query performance
    },
    userType: {
      type: String,
      required: true,
      enum: ["Client", "Vendor"],
      index: true, // Add index for better query performance
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt
  },
)

// Compound index for efficient queries
likeSchema.index({ postId: 1, userId: 1 }, { unique: true })
likeSchema.index({ userId: 1, userType: 1 })

export const Like = model<ILike>("Like", likeSchema)
