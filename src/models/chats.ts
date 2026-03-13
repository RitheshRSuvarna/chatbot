import mongoose, { Document } from "mongoose";

interface IMessage {
  role: "users" | "assistant";
  content: string;
}

export interface IChat extends Document {
  user: mongoose.Types.ObjectId;
  messages: IMessage[];
}

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>("Chat", chatSchema);