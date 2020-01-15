import { UserModel } from "../User/User";
import { Document, Schema, Model, model } from "mongoose";

export interface CountryModel extends Document {
  _id: any;
  name: string;
  prefix: string;
  flag: string;
  registrant: UserModel;
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    prefix: {
      type: String,
      required: true,
      unique: true
    },
    flag: {
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

export const Country: Model<CountryModel> = model<CountryModel>(
  "Country",
  CountrySchema
);
