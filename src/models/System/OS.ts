import { UserModel } from "../User/User";
import { Document, Schema, Model, model } from "mongoose";

export interface OSModel extends Document {
  _id: any;
  name: string;
  registrant: UserModel;
  createdAt: Date;
  updatedAt: Date;
}

const OSSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
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

export const OS: Model<OSModel> = model<OSModel>("OS", OSSchema);
