import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const getAIResponse = async (history: any[]) => {
  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: history,
    // config: {
    //   temperature: 0.3,
    //   maxOutputTokens: 10,
    //   topP: 0.9
    // }
  });

  return stream;
};