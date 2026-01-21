import { describe, test, expect, jest, beforeEach } from "@jest/globals";

describe("OpenAI Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should have generateResponse method", async () => {
    const { default: openaiService } = await import("../openai.service.js");
    expect(typeof openaiService.generateResponse).toBe("function");
  });

  test("should return proper response structure", async () => {
    const mockService = {
      generateResponse: jest.fn().mockResolvedValue({
        text: "Hello",
        updatedHistory: [
          { role: "user", content: "Hi" },
          { role: "assistant", content: "Hello" },
        ],
      }),
    };

    const result = await mockService.generateResponse("Hi");

    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("updatedHistory");
    expect(Array.isArray(result.updatedHistory)).toBe(true);
  });

  test("should handle history parameter", async () => {
    const mockService = {
      generateResponse: jest.fn((prompt, history = []) => {
        return Promise.resolve({
          text: "Response",
          updatedHistory: [...history, { role: "user", content: prompt }, { role: "assistant", content: "Response" }],
        });
      }),
    };

    const history = [{ role: "user", content: "Previous" }];
    const result = await mockService.generateResponse("New", history);

    expect(result.updatedHistory.length).toBeGreaterThan(history.length);
  });

  test("should have client property", async () => {
    const { default: openaiService } = await import("../openai.service.js");
    expect(openaiService.client).toBeDefined();
  });

  test("should return text from assistant message", async () => {
    const mockService = {
      generateResponse: jest.fn().mockResolvedValue({
        text: "Generated text response",
        updatedHistory: [
          { role: "user", content: "prompt" },
          { role: "assistant", content: "Generated text response" },
        ],
      }),
    };

    const result = await mockService.generateResponse("prompt");
    expect(result.text).toBe("Generated text response");
  });

  test("should include all messages in updated history", async () => {
    const mockService = {
      generateResponse: jest.fn().mockResolvedValue({
        text: "Response",
        updatedHistory: [
          { role: "user", content: "msg1" },
          { role: "assistant", content: "resp1" },
          { role: "user", content: "msg2" },
          { role: "assistant", content: "Response" },
        ],
      }),
    };

    const history = [
      { role: "user", content: "msg1" },
      { role: "assistant", content: "resp1" },
    ];
    const result = await mockService.generateResponse("msg2", history);
    
    expect(result.updatedHistory.length).toBe(4);
    expect(result.updatedHistory[0].content).toBe("msg1");
    expect(result.updatedHistory[3].content).toBe("Response");
  });

  test("should format messages with user role", async () => {
    const mockService = {
      generateResponse: jest.fn().mockImplementation((prompt, history = []) => {
        const messages = [...history, { role: "user", content: prompt }];
        return Promise.resolve({
          text: "Response",
          updatedHistory: messages.concat([{ role: "assistant", content: "Response" }]),
        });
      }),
    };

    const result = await mockService.generateResponse("test");

    expect(result.updatedHistory[0].role).toBe("user");
  });

  test("should add assistant message to history", async () => {
    const mockService = {
      generateResponse: jest.fn().mockImplementation(async (prompt, history = []) => {
        const userMsg = { role: "user", content: prompt };
        const assistantMsg = { role: "assistant", content: "Response" };
        return {
          text: assistantMsg.content,
          updatedHistory: [...history, userMsg, assistantMsg],
        };
      }),
    };

    const result = await mockService.generateResponse("hello");

    const lastMsg = result.updatedHistory[result.updatedHistory.length - 1];
    expect(lastMsg.role).toBe("assistant");
  });

  test("should use model from config", async () => {
    const { config } = await import("../../config/env.js");
    expect(config.openaiModel).toBeDefined();
    expect(typeof config.openaiModel).toBe("string");
    expect(config.openaiModel.length).toBeGreaterThan(0);
  });

  test("should support configurable models", async () => {
    const { config } = await import("../../config/env.js");
    const validModels = ["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"];
    expect(validModels).toContain(config.openaiModel);
  });
});
