import { model, Schema, Types } from "mongoose";
import { ICommunityPost } from "../../../domain/models/community";

const communityPostSchema = new Schema<ICommunityPost>(
  {
    communityId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Community",
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "Client" },

    title: { type: String, required: true },
    content: { type: String, required: true },
    media: [{ type: String }],
    mediaType: {
      type: String,
      enum: ["image", "video", "mixed", "none"],
      default: "none",
    },

    isEdited: { type: Boolean, default: false },

    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    comments: [{ type: Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

export default communityPostSchema;

export const CommunityPost = model('CommunityPost',communityPostSchema)