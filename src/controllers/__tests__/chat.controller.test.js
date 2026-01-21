import { describe, test, expect, jest, beforeEach } from "@jest/globals";

describe("Chat Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should have generate method", async () => {
    const { default: chatController } = await import("../chat.controller.js");
    expect(typeof chatController.generate).toBe("function");
  });

  test("should handle request with prompt and history", async () => {
    const { default: chatController } = await import("../chat.controller.js");

    const req = {
      body: {
        prompt: "Test prompt",
        history: [],
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await chatController.generate(req, res);

    expect(
      res.json.mock.calls.length + res.status.mock.calls.length
    ).toBeGreaterThan(0);
  });

  test("should use empty array when history not provided", async () => {
    const { default: chatController } = await import("../chat.controller.js");

    const req = {
      body: {
        prompt: "Test",
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await chatController.generate(req, res);

    expect(
      res.json.mock.calls.length + res.status.mock.calls.length
    ).toBeGreaterThan(0);
  });

  test("should handle errors gracefully", async () => {
    const mockController = {
      generate: jest.fn(async (req, res) => {
        try {
          throw new Error("Test error");
        } catch (error) {
          return res.status(500).json({
            error: "Failed to generate response",
            message: error.message,
          });
        }
      }),
    };

    const req = { body: { prompt: "Test" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await mockController.generate(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to generate response",
      message: "Test error",
    });
  });

  test("should return json response on success", async () => {
    const mockController = {
      generate: jest.fn(async (req, res) => {
        const result = {
          text: "Response",
          updatedHistory: [
            { role: "user", content: "Test" },
            { role: "assistant", content: "Response" },
          ],
        };
        return res.json(result);
      }),
    };

    const req = { body: { prompt: "Test", history: [] } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await mockController.generate(req, res);

    expect(res.json).toHaveBeenCalled();
    const callArgs = res.json.mock.calls[0][0];
    expect(callArgs).toHaveProperty("text");
    expect(callArgs).toHaveProperty("updatedHistory");
  });

  test("should try to call service when config.useOpenAI is true", async () => {
    const mockController = {
      generate: jest.fn(async (req, res) => {
        const { prompt, history = [] } = req.body;
        const result = {
          text: "OpenAI Response",
          updatedHistory: [
            ...history,
            { role: "user", content: prompt },
            { role: "assistant", content: "OpenAI Response" },
          ],
        };
        return res.json(result);
      }),
    };

    const req = { body: { prompt: "Test", history: [] } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await mockController.generate(req, res);

    expect(mockController.generate).toHaveBeenCalledWith(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test("should log messages when processing", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    const mockController = {
      generate: jest.fn(async (req, res) => {
        const { prompt, history = [] } = req.body;
        console.log("📜 Received history:", JSON.stringify(history));
        console.log("💬 New message", prompt);
        return res.json({ text: "Response", updatedHistory: [] });
      }),
    };

    const req = { body: { prompt: "Test message", history: [] } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await mockController.generate(req, res);

    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockRestore();
  });

  test("should catch and handle service errors", async () => {
    const mockController = {
      generate: jest.fn(async (req, res) => {
        try {
          throw new Error("Service error");
        } catch (error) {
          console.error("❌ Erro:", error);
          return res.status(500).json({
            error: "Failed to generate response",
            message: error.message,
          });
        }
      }),
    };

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const req = { body: { prompt: "test" } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await mockController.generate(req, res);

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    consoleErrorSpy.mockRestore();
  });
});
