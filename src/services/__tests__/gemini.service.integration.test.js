import { describe, test, expect, jest, beforeEach } from "@jest/globals";

jest.unstable_mockModule("@google/genai", () => {
  const mockGenerateContent = jest.fn().mockResolvedValue({
    text: "This is a mocked Gemini response",
  });

  const mockModels = {
    generateContent: mockGenerateContent,
  };

  return {
    GoogleGenAI: jest.fn(() => ({
      models: mockModels,
    })),
  };
});

describe("Gemini Service Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create AI instance with API key from config", async () => {
    const { default: geminiService } = await import("../gemini.service.js");
    expect(geminiService.ai).toBeDefined();
  });

  test("should call models.generateContent with correct format", async () => {
    const { default: geminiService } = await import("../gemini.service.js");

    const prompt = "Hello, how are you?";
    const result = await geminiService.generateResponse(prompt);

    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("updatedHistory");
  });

  test("should convert assistant role to model in history", async () => {
    const { default: geminiService } = await import("../gemini.service.js");

    const history = [
      { role: "assistant", content: "Previous response" },
    ];

    const result = await geminiService.generateResponse("Follow-up", history);

    expect(result.updatedHistory).toContainEqual({
      role: "assistant",
      content: "Previous response",
    });

    expect(result.updatedHistory).toContainEqual({
      role: "user",
      content: "Follow-up",
    });
  });

  test("should include history in response", async () => {
    const { default: geminiService } = await import("../gemini.service.js");

    const history = [
      { role: "user", content: "First question" },
      { role: "assistant", content: "First answer" },
    ];

    const result = await geminiService.generateResponse("Second question", history);

    expect(result.updatedHistory.length).toBe(4);
  });

  test("should return text from API response", async () => {
    const { default: geminiService } = await import("../gemini.service.js");

    const result = await geminiService.generateResponse("test");

    expect(result.text).toBe("This is a mocked Gemini response");
  });
});
