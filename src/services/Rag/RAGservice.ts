import { retrieveContext } from "./retriver.service";
import { getAIResponse } from "../Gemini";

export const ragService = {
  async getAIResponse(history: any[]) {

    const query = history[history.length - 1].parts[0].text;

    // retrieve relevant document chunks
    const context = await retrieveContext(query);

    const augmentedPrompt = `
Context:
${context}

Question:
${query}
`;

    history[history.length - 1].parts[0].text = augmentedPrompt;

    return await getAIResponse(history);
  }
};