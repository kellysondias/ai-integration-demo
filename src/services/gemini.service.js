import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";

class GeminiService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: config.geminiApiKey,
    });
  }

  async generateResponse(prompt, history = []) {
    const contents = [
      ...history.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ];

    const response = await this.ai.models.generateContent({
      model: config.geminiModel,
      contents: contents,
    });

    const assistantMessage = response.text;

    return {
      text: assistantMessage,
      updatedHistory: [
        ...history,
        { role: "user", content: prompt },
        { role: "assistant", content: assistantMessage },
      ],
    };
  }
}

export default new GeminiService();
