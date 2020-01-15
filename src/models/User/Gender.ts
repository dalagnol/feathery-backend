import { Document, Schema, Model, model } from "mongoose";

export interface GenderModel extends Document {
  _id: any;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const GenderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

export const Gender: Model<GenderModel> = model<GenderModel>(
  "Gender",
  GenderSchema
);
