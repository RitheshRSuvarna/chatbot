import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

//console.log("USING NEW SDK");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const getAIResponse = async (prompt: string): Promise<string> => {
  console.log("Generating AI response for prompt:", prompt);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are a helpful assisatnat who answers in short sentences. Try to keep your answers pretty short and informative",
    }
  });
  console.log("AI response received:", ai);

  return response.text ?? "";
};