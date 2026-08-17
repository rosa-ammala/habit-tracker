import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./app";

describe("app middleware", () => {
  it("returns 413 when request body is too large", async () => {
    const response = await request(app)
      .post("/api/habits")
      .send({
        title: "a".repeat(11_000),
        categoryId: 1,
      })
      .expect(413);

    expect(response.body).toEqual({
      code: "PAYLOAD_TOO_LARGE",
      message: "Request body is too large",
    });
  });

  it("returns 400 when request body contains invalid JSON", async () => {
    const response = await request(app)
      .post("/api/habits")
      .set("Content-Type", "application/json")
      .send("{")
      .expect(400);

    expect(response.body).toEqual({
      code: "INVALID_JSON",
      message: "Invalid JSON body",
    });
  });
});
