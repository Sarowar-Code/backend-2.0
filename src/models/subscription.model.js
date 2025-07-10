import { Schema, model } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // User who is subscribing
      ref: "User",
    },
    channal: {
      type: Schema.Types.ObjectId, // One who is being subscribed to
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = model("Subscription", subscriptionSchema);
