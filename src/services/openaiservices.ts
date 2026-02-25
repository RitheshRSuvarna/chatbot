import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const getAIResponse = async (prompt: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return content;
};
export{};