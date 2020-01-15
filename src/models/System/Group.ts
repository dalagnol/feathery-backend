import { Document, Schema, Model, model } from "mongoose";
import { PermissionModel } from "./Permission";

export interface GroupModel extends Document {
  _id: any;
  name: string;
  permissions: Array<PermissionModel>;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission"
      }
    ]
  },
  {
    minimize: false,
    timestamps: true
  }
);

export const Group: Model<GroupModel> = model<GroupModel>("Group", GroupSchema);
