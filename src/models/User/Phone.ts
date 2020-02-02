import { Document, Schema, Model, model } from "mongoose";

export interface PhoneModel extends Document {
  _id: any;
  ddi: string;
  number: string;
  createdAt: Date;
  updatedAt: Date;
}

const PhoneSchema = new Schema(
  {
    ddi: {
      type: Number,
      required: true
    },
    number: {
      type: String,
      required: true
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

PhoneSchema.index(["ddi", "number"], { unique: true });

PhoneSchema.post("save", async (doc: PhoneModel) => {
  await doc.updateOne({ number: doc.number.match(/\d+/g)?.join("") });
});

export const Phone: Model<PhoneModel> = model<PhoneModel>("Phone", PhoneSchema);
