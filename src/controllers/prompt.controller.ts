console.log("Normal chat endpoint hit");
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Chat from "../models/chats";
import { getAIResponse } from "../services/Gemini";
import { request } from "node:http";

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    //console.log("Endpoint hit");

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const aiResponse = await getAIResponse(prompt);

    const chat = await Chat.create({
      user: req.user.id,   // from JWT middleware
      prompt,
      response: aiResponse,
    }as any);

    res.status(200).json({ response: aiResponse });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  const chats = await Chat.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.json(chats);
};
export{};