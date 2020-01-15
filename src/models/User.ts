import { Document, Schema, Model, model } from "mongoose";

export interface UserModel extends Document {
  _id: any;
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const User: Model<UserModel> = model<UserModel>("User", UserSchema);
