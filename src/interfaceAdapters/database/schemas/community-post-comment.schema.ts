import { model, Schema } from "mongoose";
import { IComment } from "../../../domain/models/community";

const communityCommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "CommunityPost",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },
    userType: {
      type: String,
      enum: ["Client", "Vendor"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model<IComment>("Comment", communityCommentSchema);
