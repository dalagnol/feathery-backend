import { AuthorModel } from "../User/User";
import { Document, Schema, Model, model } from "mongoose";

export interface PostModel extends Document {
  _id: any;
  title: string;
  subtitle: string;
  draftJS: string;
  content: string;
  html: string;
  author: AuthorModel;
  visibility: boolean;
}

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String
    },
    draftJS: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    html: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    visibility: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

export const Post: Model<PostModel> = model<PostModel>("Post", PostSchema);
