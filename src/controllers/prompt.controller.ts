console.log("Normal chat endpoint hit");
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Chat from "../models/chats";
import { getAIResponse } from "../services/Gemini";
import { request } from "node:http";

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
   const { prompt, _id } = req.body;

const chat = await Chat.findById(_id);

if (!prompt) {
  return res.status(400).json({ message: "prompt is required" });
}

// build history from previous messages
const history = chat?.messages.map((msg: any) => ({
  role: msg.role,
  parts: [{ text: msg.content }],
})) || [];

// add the new prompt
history.push({
  role: "user",
  parts: [{ text: prompt }],
});

// send history to AI
const stream = await getAIResponse(history);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    let fullResponse = "";

    for await (const chunk of stream) {
      if (typeof chunk === 'object' && chunk.text) {
        fullResponse += chunk.text;

        res.write(`data: ${chunk.text}\n\n`);
      } else if (typeof chunk === 'string') {
        fullResponse += chunk;

        res.write(`data: ${chunk}\n\n`);
      }
    }

    await Chat.updateOne(
  { _id },
  {
    $push: {
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: fullResponse },
      ],
    },
  }
);
    res.write("data: [DONE]\n\n");
    res.end();

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