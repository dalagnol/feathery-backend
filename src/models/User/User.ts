import { GroupModel } from "../System/Group";
import { GenderModel } from "./Gender";
import { EmailModel } from "./Email";
import { PhoneModel } from "./Phone";
import { Document, Schema, Model, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserModel extends Document {
  _id: any;
  identifier: string;
  name: string;
  email: EmailModel;
  phone?: PhoneModel;
  password: string;
  gender: GenderModel;
  active: boolean;
  picture?: string;
  group: GroupModel;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorModel {
  _id: any;
  identifier: string;
  email: EmailModel;
  name: string;
  type: string;
}

export interface OwnerModel {
  _id: any;
  identifier: string;
  email: EmailModel;
  name: string;
  type: string;
}

const UserSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 100
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: Schema.Types.ObjectId,
      ref: "Email",
      unique: true,
      required: true,
      minlength: 5,
      maxlength: 120
    },
    phone: {
      type: Schema.Types.ObjectId,
      ref: "Phone",
      unique: true
    },
    gender: {
      type: Schema.Types.ObjectId,
      ref: "Gender",
      required: true
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true
    },
    picture: {
      type: String
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 120
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

UserSchema.post("save", async (doc: UserModel) => {
  await doc.updateOne({ password: await bcrypt.hash(doc.password, 8) });
});

export const User: Model<UserModel> = model<UserModel>("User", UserSchema);

User.collection.createIndex(["phone"], {
  partialFilterExpression: { phone: { $exists: true } },
  unique: true
});
