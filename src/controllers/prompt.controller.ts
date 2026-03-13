console.log("Normal chat endpoint hit");
import { ragService } from "../services/Rag/RAGservice";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Chat from "../models/chats";
import { getAIResponse } from "../services/Gemini";

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, _id } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "prompt is required" });
    }

    // find chat
    let chat = _id ? await Chat.findById(_id) : null;

    // build history from previous messages
    const history = chat?.messages.map((msg: any) => ({
  role: msg.role === "assistant" ? "model" : "user",
  parts: [{ text: msg.content }],
})) || []

history.unshift({
  role: "user",
  parts: [{ text: "You are an useful assistant who gives short answers for the queries. You will answer only what you know otherwise you will say Sorry, I dont know anything about this" }]
});

    // add current prompt
    history.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    // send conversation to Gemini
    const stream = await ragService.getAIResponse(history);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    let fullResponse = "";

    console.log("Stream received from Gemini:");

    // stream response
    for await (const chunk of stream) {
      if (typeof chunk === "object" && chunk.text) {
        fullResponse += chunk.text;
        res.write(`data: ${chunk.text}\n\n`);
      } else if (typeof chunk === "string") {
        fullResponse += chunk;
        res.write(`data: ${chunk}\n\n`);
      }
    }

    // if chat doesn't exist → create new chat
    if (!chat) {
      chat = await Chat.create({
        user: req.user.id,
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: fullResponse },
        ],
      });
    } 
    // otherwise update existing chat
    else {
      await Chat.updateOne(
        { _id },
        {
          $push: {
            messages: {
              $each: [
                { role: "user", content: prompt },
                { role: "assistant", content: fullResponse },
              ],
            },
          },
        }
      );
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(chats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};