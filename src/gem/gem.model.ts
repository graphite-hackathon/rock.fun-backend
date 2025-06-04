import { Schema, model } from "mongoose";
import { IGem } from "./gem.interface";

const GemSchema = new Schema<IGem>(
  {
    contractAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    decimals: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    totalSupply: {
      type: String,
      required: true,
    },
    creatorAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    networkChainId: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

GemSchema.index({ creatorAddress: 1 });
GemSchema.index({ symbol: 1 });
GemSchema.index({ name: 1 });

const GemModel = model<IGem>("Gem", GemSchema);

export { GemModel };
