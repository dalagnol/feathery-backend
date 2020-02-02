import { Document, Schema, Model, model } from "mongoose";

export interface EmailModel extends Document {
  _id: any;
  address: string;
  domain: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailSchema = new Schema(
  {
    address: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

EmailSchema.index(["address", "domain"], { unique: true });

EmailSchema.post("save", async (doc: EmailModel) => {
  await doc.updateOne({
    address: doc.address.toLowerCase(),
    domain: doc.domain.toLowerCase()
  });
});

export const Email: Model<EmailModel> = model<EmailModel>("Email", EmailSchema);
