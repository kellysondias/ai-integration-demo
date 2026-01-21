import { config } from "../config/env.js";
import openaiService from "../services/openai.service.js";
import geminiService from "../services/gemini.service.js";

class ChatController {
  async generate(req, res) {
    try {
      const { prompt, history = [] } = req.body;

      console.log("📜 Received history:", JSON.stringify(history, null, 2));
      console.log("💬 New message", prompt);

      let result;

      if (config.useOpenAI) {
        result = await openaiService.generateResponse(prompt, history);
      } else {
        result = await geminiService.generateResponse(prompt, history);
      }

      return res.json(result);
    } catch (error) {
      console.error("❌ Erro:", error);
      return res.status(500).json({
        error: "Failed to generate response",
        message: error.message,
      });
    }
  }
}

export default new ChatController();
