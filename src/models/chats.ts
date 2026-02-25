import mongoose, { Document } from "mongoose";

export interface IChat extends Document {
  user: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
}

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IChat>("Chat", chatSchema);
export{};
