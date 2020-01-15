import { PostModel, Post } from "./Post";
import { OwnerModel } from "../User/User";
import { Document, Schema, Model, model } from "mongoose";

export interface TagModel extends Document {
  _id: any;
  name: string;
  posts: Array<PostModel>;
  registrant: OwnerModel;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    registrant: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

export const Tag: Model<TagModel> = model<TagModel>("Tag", TagSchema);
