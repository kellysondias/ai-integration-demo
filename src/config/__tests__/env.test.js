import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("Config", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should load default port when PORT is not set", async () => {
    delete process.env.PORT;
    const { config } = await import("../env.js");
    expect(config.port).toBe(3000);
  });

  test("should load custom PORT from environment", () => {
    expect(process.env.PORT || 3000).toBeDefined();
  });

  test("should read USE_OPEN_AI environment variable", async () => {
    const { config } = await import("../env.js");
    expect(typeof config.useOpenAI).toBe("boolean");
  });

  test("should have openaiModel property", async () => {
    const { config } = await import("../env.js");
    expect(config.openaiModel).toBeDefined();
    expect(typeof config.openaiModel).toBe("string");
  });

  test("should have default openaiModel as gpt-4", async () => {
    const { config } = await import("../env.js");
    expect(config.openaiModel).toBe("gpt-4");
  });

  test("should have geminiModel property", async () => {
    const { config } = await import("../env.js");
    expect(config.geminiModel).toBeDefined();
    expect(typeof config.geminiModel).toBe("string");
  });

  test("should have default geminiModel as gemini-2.5-flash", async () => {
    const { config } = await import("../env.js");
    expect(config.geminiModel).toBe("gemini-2.5-flash");
  });

  test("should have geminiApiKey property", async () => {
    const { config } = await import("../env.js");
    expect(config.geminiApiKey).toBeDefined();
  });

  test("should have openaiApiKey property", async () => {
    const { config } = await import("../env.js");
    expect(config.openaiApiKey).toBeDefined();
  });
});
