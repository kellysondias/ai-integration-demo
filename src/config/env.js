import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  useOpenAI: process.env.USE_OPEN_AI === "true",
  openaiApiKey: process.env.OPEN_AI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || "gpt-4",
  geminiApiKey: process.env.GOOGLE_GENAI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};