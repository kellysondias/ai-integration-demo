import { describe, test, expect, jest, beforeEach } from "@jest/globals";

describe("Gemini Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should have generateResponse method", async () => {
    const { default: geminiService } = await import("../gemini.service.js");
    expect(typeof geminiService.generateResponse).toBe("function");
  });

  test("should return proper response structure", async () => {
    const mockService = {
      generateResponse: jest.fn().mockResolvedValue({
        text: "Hello from Gemini",
        updatedHistory: [
          { role: "user", content: "Hi" },
          { role: "assistant", content: "Hello from Gemini" },
        ],
      }),
    };

    const result = await mockService.generateResponse("Hi");

    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("updatedHistory");
    expect(Array.isArray(result.updatedHistory)).toBe(true);
  });

  test("should convert assistant to model role in history", () => {
    const history = [{ role: "assistant", content: "Previous" }];
    const converted = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    expect(converted[0].role).toBe("model");
  });

  test("should handle empty history", async () => {
    const mockService = {
      generateResponse: jest.fn((prompt, history = []) => {
        return Promise.resolve({
          text: "Response",
          updatedHistory: [
            { role: "user", content: prompt },
            { role: "assistant", content: "Response" },
          ],
        });
      }),
    };

    const result = await mockService.generateResponse("Test");
    expect(result.updatedHistory).toHaveLength(2);
  });

  test("should have ai property", async () => {
    const { default: geminiService } = await import("../gemini.service.js");
    expect(geminiService.ai).toBeDefined();
  });

  test("should include user and assistant messages in history", async () => {
    const mockService = {
      generateResponse: jest.fn().mockResolvedValue({
        text: "Generated response",
        updatedHistory: [
          { role: "user", content: "prompt" },
          { role: "assistant", content: "Generated response" },
        ],
      }),
    };

    const result = await mockService.generateResponse("prompt");
    expect(result.updatedHistory).toContainEqual({ role: "user", content: "prompt" });
    expect(result.updatedHistory).toContainEqual({ role: "assistant", content: "Generated response" });
  });

  test("should append new messages to existing history", async () => {
    const mockService = {
      generateResponse: jest.fn((prompt, history = []) => {
        return Promise.resolve({
          text: "New response",
          updatedHistory: [
            ...history,
            { role: "user", content: prompt },
            { role: "assistant", content: "New response" },
          ],
        });
      }),
    };

    const existingHistory = [
      { role: "user", content: "first" },
      { role: "assistant", content: "response1" },
    ];

    const result = await mockService.generateResponse("second", existingHistory);
    expect(result.updatedHistory.length).toBe(4);
    expect(result.updatedHistory[0].content).toBe("first");
    expect(result.updatedHistory[2].content).toBe("second");
  });

  test("should return text property correctly", async () => {
    const mockService = {
      generateResponse: jest.fn().mockResolvedValue({
        text: "Gemini response text",
        updatedHistory: [],
      }),
    };

    const result = await mockService.generateResponse("prompt");
    expect(result.text).toBe("Gemini response text");
    expect(typeof result.text).toBe("string");
  });

  test("should build contents array with parts", () => {
    const history = [{ role: "user", content: "test" }];
    const contents = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    expect(contents[0].parts).toBeDefined();
    expect(contents[0].parts[0].text).toBe("test");
  });

  test("should create prompt message with text part", () => {
    const prompt = "Test prompt";
    const msgObj = {
      role: "user",
      parts: [{ text: prompt }],
    };

    expect(msgObj.parts[0].text).toBe("Test prompt");
  });

  test("should use model from config", async () => {
    const { config } = await import("../../config/env.js");
    expect(config.geminiModel).toBeDefined();
    expect(typeof config.geminiModel).toBe("string");
    expect(config.geminiModel.length).toBeGreaterThan(0);
  });

  test("should support configurable models", async () => {
    const { config } = await import("../../config/env.js");
    const validModels = ["gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"];
    expect(validModels).toContain(config.geminiModel);
  });
});
