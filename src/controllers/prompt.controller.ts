import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Chat from "../models/chats";
import { getAIResponse } from "../services/openaiservices";

export const createChat = async (req: AuthRequest, res: Response) => {
  const { prompt } = req.body;

  const aiResponse = await getAIResponse(prompt);

  const chat = await Chat.create({
    user: req.user.id,
    prompt,
    response: aiResponse,
  });

  res.json(chat);
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  const chats = await Chat.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(chats);
};
export{};