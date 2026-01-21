import app from "./src/app.js";
import { config } from "./src/config/env.js";

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`🤖 Using ${config.useOpenAI ? "OpenAI" : "Google Gemini"}`);
});
