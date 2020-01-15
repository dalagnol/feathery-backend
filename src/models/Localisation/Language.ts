import { UserModel } from "../User/User";
import { Document, Schema, Model, model } from "mongoose";
import { CountryModel } from "./Country";

export interface LanguageModel extends Document {
  _id: any;
  name: string;
  prefix: string;
  countries: Array<CountryModel>;
  registrant: UserModel;
  createdAt: Date;
  updatedAt: Date;
}

const LanguageSchema = new Schema(
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
    countries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Country"
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

export const Language: Model<LanguageModel> = model<LanguageModel>(
  "Language",
  LanguageSchema
);
