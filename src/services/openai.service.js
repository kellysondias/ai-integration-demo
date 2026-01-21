import OpenAI from "openai";
import { config } from "../config/env.js";

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async generateResponse(prompt, history = []) {
    const messages = [...history, { role: "user", content: prompt }];

    const response = await this.client.chat.completions.create({
      model: config.openaiModel,
      messages: messages,
      max_tokens: 200,
    });

    const assistantMessage = response.choices[0].message.content;

    return {
      text: assistantMessage,
      updatedHistory: [
        ...messages,
        { role: "assistant", content: assistantMessage },
      ],
    };
  }
}

export default new OpenAIService();
