import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../app.js";

describe("App", () => {
  test("should respond to health check", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("timestamp");
  });

  test("should have JSON middleware", () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe("function");
  });

  test("should have api routes mounted", async () => {
    const response = await request(app)
      .post("/api/generate")
      .send({
        prompt: "test",
        history: [],
      })
      .catch((err) => err.response);

    expect(response?.status).not.toBe(404);
  });
});
