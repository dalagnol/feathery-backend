import { UserModel } from "../User/User";
import { Document, Schema, Model, model } from "mongoose";

export interface SocketModel extends Document {
  _id: any;
  socketId: string;
  registrant?: UserModel;
  createdAt: Date;
  updatedAt: Date;
}

const SocketSchema = new Schema(
  {
    socketId: {
      type: String,
      required: true,
      unique: true
    },
    registrant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

export const Socket: Model<SocketModel> = model<SocketModel>(
  "Socket",
  SocketSchema
);
