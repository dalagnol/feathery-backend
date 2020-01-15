import { Document, Schema, Model, model } from "mongoose";

export interface PermissionModel extends Document {
  _id: any;
  name: string;
  code: string;
  description: string;
  methods: Array<string>;
  uri: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      unique: true
    },
    methods: {
      type: [String],
      required: true
    },
    uri: {
      type: String,
      required: true
    }
  },
  {
    minimize: false,
    timestamps: true
  }
);

PermissionSchema.index(["methods", "uri"], { unique: true });

export const Permission: Model<PermissionModel> = model<PermissionModel>(
  "Permission",
  PermissionSchema
);
