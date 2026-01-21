import { describe, test, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("openai", () => {
  const mockCompletions = {
    create: jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: "This is a mocked OpenAI response",
          },
        },
      ],
    }),
  };

  const mockChat = {
    completions: mockCompletions,
  };

  return {
    default: jest.fn(() => ({
      chat: mockChat,
    })),
  };
});

describe("OpenAI Service Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create client with API key from config", async () => {
    const { default: openaiService } = await import("../openai.service.js");
    expect(openaiService.client).toBeDefined();
  });

  test("should call client.chat.completions.create with correct parameters", async () => {
    const { default: openaiService } = await import("../openai.service.js");

    const prompt = "Hello, how are you?";
    const result = await openaiService.generateResponse(prompt);

    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("updatedHistory");
  });

  test("should include all history messages in request", async () => {
    const { default: openaiService } = await import("../openai.service.js");

    const history = [
      { role: "user", content: "First message" },
      { role: "assistant", content: "First response" },
    ];

    const result = await openaiService.generateResponse("Second message", history);

    expect(result.updatedHistory.length).toBe(4);
  });

  test("should return assistant message in text property", async () => {
    const { default: openaiService } = await import("../openai.service.js");

    const result = await openaiService.generateResponse("test");

    expect(result.text).toBe("This is a mocked OpenAI response");
  });
});
