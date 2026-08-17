import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../app";
import { prisma } from "../config/prisma";
import { getTodayInTimezone } from "../utils/date";

type RequestBody = Record<string, unknown>;
type BodyValidationCase = [string, RequestBody];
type ErrorBodyValidationCase = [string, RequestBody, string, string];

async function cleanDatabase() {
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.category.deleteMany();
}

function toDateOnlyString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: string, amount: number) {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + amount);
  return toDateOnlyString(result);
}

function expectErrorResponse(
  response: { body: unknown },
  code: string,
  message: string
) {
  expect(response.body).toEqual({
    code,
    message,
  });
}

async function createCategory(name = "Health") {
  return prisma.category.create({
    data: {
      name,
      icon: "health.svg",
    },
  });
}

async function createHabit(title = "Drink water") {
  const category = await createCategory();

  return prisma.habit.create({
    data: {
      title,
      categoryId: category.id,
    },
  });
}

describe("habits API", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
  });

  it("creates a habit linked to an existing category", async () => {
    const category = await prisma.category.create({
      data: {
        name: "Health",
        icon: "health.svg",
      },
    });

    const response = await request(app)
      .post("/api/habits")
      .send({
        title: "Drink water",
        categoryId: category.id,
      })
      .expect(201);

    expect(response.body).toMatchObject({
      title: "Drink water",
      categoryId: category.id,
      category: {
        id: category.id,
        name: "Health",
        icon: "health.svg",
      },
      logs: [],
      currentStreak: 0,
      bestStreak: 0,
    });

    expect(response.body.id).toEqual(expect.any(Number));
  });

  it("returns 404 when creating a habit with missing category", async () => {
    const response = await request(app)
      .post("/api/habits")
      .send({
        title: "Read",
        categoryId: 999999,
      })
      .expect(404);

    expect(response.body).toEqual({
      code: "CATEGORY_NOT_FOUND",
      message: "Category not found",
    });
  });

  it("returns 400 when creating a habit with too long title", async () => {
    const response = await request(app)
      .post("/api/habits")
      .send({
        title: "a".repeat(81),
        categoryId: 1,
      })
      .expect(400);

    expect(response.body).toEqual({
      code: "TITLE_TOO_LONG",
      message: "Title must be 80 characters or fewer",
    });
  });

  it.each<BodyValidationCase>([
    ["missing title", { categoryId: 1 }],
    ["blank title", { title: "   ", categoryId: 1 }],
  ])("returns 400 when creating a habit with %s", async (_caseName, body) => {
    const response = await request(app)
      .post("/api/habits")
      .send(body)
      .expect(400);

    expectErrorResponse(response, "TITLE_REQUIRED", "Title is required");
  });

  it.each<BodyValidationCase>([
    ["missing categoryId", { title: "Read" }],
    ["zero categoryId", { title: "Read", categoryId: 0 }],
    ["negative categoryId", { title: "Read", categoryId: -1 }],
    ["decimal categoryId", { title: "Read", categoryId: 1.5 }],
    ["non-numeric categoryId", { title: "Read", categoryId: "abc" }],
  ])("returns 400 when creating a habit with %s", async (_caseName, body) => {
    const response = await request(app)
      .post("/api/habits")
      .send(body)
      .expect(400);

    expectErrorResponse(
      response,
      "INVALID_CATEGORY_ID",
      "Valid categoryId is required"
    );
  });

  it("returns habits with categories", async () => {
    const category = await prisma.category.create({
      data: {
        name: "Learning",
        icon: "book.svg",
      },
    });

    await prisma.habit.create({
      data: {
        title: "Read 10 pages",
        categoryId: category.id,
      },
    });

    const response = await request(app)
      .get("/api/habits?timezone=Europe/Helsinki")
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      title: "Read 10 pages",
      categoryId: category.id,
      category: {
        name: "Learning",
        icon: "book.svg",
      },
      logs: [],
      currentStreak: 0,
      bestStreak: 0,
    });
  });

  it("returns 400 when fetching habits with invalid timezone", async () => {
    const response = await request(app)
      .get("/api/habits?timezone=Invalid/Timezone")
      .expect(400);

    expect(response.body).toEqual({
      code: "INVALID_TIMEZONE",
      message: "Invalid timezone",
    });
  });

  it("returns 400 when fetching a habit with invalid timezone", async () => {
    const response = await request(app)
      .get("/api/habits/1?timezone=Invalid/Timezone")
      .expect(400);

    expect(response.body).toEqual({
      code: "INVALID_TIMEZONE",
      message: "Invalid timezone",
    });
  });

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 400 when fetching habit with invalid id %s",
    async (id) => {
      const response = await request(app)
        .get(`/api/habits/${id}`)
        .expect(400);

      expectErrorResponse(
        response,
        "INVALID_HABIT_ID",
        "Valid habit id is required"
      );
    }
  );

  it("returns 404 when fetching a missing habit", async () => {
    const response = await request(app)
      .get("/api/habits/999999")
      .expect(404);

    expectErrorResponse(response, "HABIT_NOT_FOUND", "Habit not found");
  });

  it("updates a habit", async () => {
    const habit = await createHabit("Read");
    const category = await prisma.category.create({
      data: {
        name: "Learning",
        icon: "book.svg",
      },
    });

    const response = await request(app)
      .patch(`/api/habits/${habit.id}`)
      .send({
        title: "Read 20 pages",
        categoryId: category.id,
      })
      .expect(200);

    expect(response.body).toMatchObject({
      id: habit.id,
      title: "Read 20 pages",
      categoryId: category.id,
    });
  });

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 400 when updating habit with invalid id %s",
    async (id) => {
      const response = await request(app)
        .patch(`/api/habits/${id}`)
        .send({
          title: "Read",
          categoryId: 1,
        })
        .expect(400);

      expectErrorResponse(
        response,
        "INVALID_HABIT_ID",
        "Valid habit id is required"
      );
    }
  );

  it("returns 404 when updating a missing habit", async () => {
    const category = await createCategory();

    const response = await request(app)
      .patch("/api/habits/999999")
      .send({
        title: "Read",
        categoryId: category.id,
      })
      .expect(404);

    expectErrorResponse(response, "HABIT_NOT_FOUND", "Habit not found");
  });

  it("returns 404 when updating a habit with missing category", async () => {
    const habit = await createHabit("Read");

    const response = await request(app)
      .patch(`/api/habits/${habit.id}`)
      .send({
        title: "Read",
        categoryId: 999999,
      })
      .expect(404);

    expectErrorResponse(response, "CATEGORY_NOT_FOUND", "Category not found");
  });

  it.each<ErrorBodyValidationCase>([
    ["missing title", { categoryId: 1 }, "TITLE_REQUIRED", "Title is required"],
    [
      "blank title",
      { title: "   ", categoryId: 1 },
      "TITLE_REQUIRED",
      "Title is required",
    ],
    [
      "too long title",
      { title: "a".repeat(81), categoryId: 1 },
      "TITLE_TOO_LONG",
      "Title must be 80 characters or fewer",
    ],
    [
      "invalid categoryId",
      { title: "Read", categoryId: "abc" },
      "INVALID_CATEGORY_ID",
      "Valid categoryId is required",
    ],
  ])(
    "returns 400 when updating a habit with %s",
    async (_caseName, body, code, message) => {
      const habit = await createHabit("Read");

      const response = await request(app)
        .patch(`/api/habits/${habit.id}`)
        .send(body)
        .expect(400);

      expectErrorResponse(response, code, message);
    }
  );

  it("deletes a habit", async () => {
    const habit = await createHabit("Read");

    const response = await request(app)
      .delete(`/api/habits/${habit.id}`)
      .expect(200);

    expect(response.body).toEqual({
      message: "Habit deleted",
    });
  });

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 400 when deleting habit with invalid id %s",
    async (id) => {
      const response = await request(app)
        .delete(`/api/habits/${id}`)
        .expect(400);

      expectErrorResponse(
        response,
        "INVALID_HABIT_ID",
        "Valid habit id is required"
      );
    }
  );

  it("returns 404 when deleting a missing habit", async () => {
    const response = await request(app)
      .delete("/api/habits/999999")
      .expect(404);

    expectErrorResponse(response, "HABIT_NOT_FOUND", "Habit not found");
  });

  it("adds a habit log and returns updated streaks", async () => {
    const today = getTodayInTimezone("Europe/Helsinki");
    const yesterday = addDays(today, -1);
    const category = await prisma.category.create({
      data: {
        name: "Health",
        icon: "health.svg",
      },
    });

    const habit = await prisma.habit.create({
      data: {
        title: "Sleep early",
        categoryId: category.id,
      },
    });

    await request(app)
      .post(`/api/habits/${habit.id}/logs`)
      .send({
        date: yesterday,
        timezone: "Europe/Helsinki",
      })
      .expect(201);

    const response = await request(app)
      .post(`/api/habits/${habit.id}/logs`)
      .send({
        date: today,
        timezone: "Europe/Helsinki",
      })
      .expect(201);

    expect(response.body.logs).toHaveLength(2);
    expect(response.body.logs[0].date).toBe(yesterday);
    expect(response.body.logs[1].date).toBe(today);
    expect(response.body.currentStreak).toBe(2);
    expect(response.body.bestStreak).toBe(2);
  });

  it("returns 400 when adding a habit log with invalid timezone", async () => {
    const response = await request(app)
      .post("/api/habits/1/logs")
      .send({
        date: "2026-06-10",
        timezone: "Invalid/Timezone",
      })
      .expect(400);

    expect(response.body).toEqual({
      code: "INVALID_TIMEZONE",
      message: "Invalid timezone",
    });
  });

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 400 when adding habit log with invalid habit id %s",
    async (id) => {
      const response = await request(app)
        .post(`/api/habits/${id}/logs`)
        .send({
          date: getTodayInTimezone("Europe/Helsinki"),
          timezone: "Europe/Helsinki",
        })
        .expect(400);

      expectErrorResponse(
        response,
        "INVALID_HABIT_ID",
        "Valid habit id is required"
      );
    }
  );

  it("returns 400 when adding a habit log without date", async () => {
    const response = await request(app)
      .post("/api/habits/1/logs")
      .send({
        timezone: "Europe/Helsinki",
      })
      .expect(400);

    expectErrorResponse(response, "DATE_REQUIRED", "Date is required");
  });

  it("returns 400 when adding a habit log with invalid date", async () => {
    const response = await request(app)
      .post("/api/habits/1/logs")
      .send({
        date: "2026-02-31",
        timezone: "Europe/Helsinki",
      })
      .expect(400);

    expectErrorResponse(response, "INVALID_DATE", "Invalid date");
  });

  it("returns 400 when adding a habit log for a future date", async () => {
    const tomorrow = addDays(getTodayInTimezone("Europe/Helsinki"), 1);

    const response = await request(app)
      .post("/api/habits/1/logs")
      .send({
        date: tomorrow,
        timezone: "Europe/Helsinki",
      })
      .expect(400);

    expectErrorResponse(
      response,
      "FUTURE_DATE_NOT_ALLOWED",
      "Cannot log future dates"
    );
  });

  it("returns 400 when adding a habit log without timezone", async () => {
    const response = await request(app)
      .post("/api/habits/1/logs")
      .send({
        date: getTodayInTimezone("Europe/Helsinki"),
      })
      .expect(400);

    expectErrorResponse(response, "TIMEZONE_REQUIRED", "Timezone is required");
  });

  it("returns 404 when adding a habit log for a missing habit", async () => {
    const response = await request(app)
      .post("/api/habits/999999/logs")
      .send({
        date: getTodayInTimezone("Europe/Helsinki"),
        timezone: "Europe/Helsinki",
      })
      .expect(404);

    expectErrorResponse(response, "HABIT_NOT_FOUND", "Habit not found");
  });

  it("returns 409 when adding duplicate log", async () => {
    const category = await prisma.category.create({
      data: {
        name: "Fitness",
        icon: "dumbbell.svg",
      },
    });

    const habit = await prisma.habit.create({
      data: {
        title: "Workout",
        categoryId: category.id,
      },
    });

    await request(app)
      .post(`/api/habits/${habit.id}/logs`)
      .send({
        date: "2026-06-10",
        timezone: "Europe/Helsinki",
      })
      .expect(201);

    const response = await request(app)
      .post(`/api/habits/${habit.id}/logs`)
      .send({
        date: "2026-06-10",
        timezone: "Europe/Helsinki",
      })
      .expect(409);

    expect(response.body).toEqual({
      code: "LOG_ALREADY_EXISTS",
      message: "Log already exists for this date",
    });
  });

  it("deletes a habit log and returns updated habit", async () => {
    const category = await prisma.category.create({
      data: {
        name: "Health",
        icon: "health.svg",
      },
    });

    const habit = await prisma.habit.create({
      data: {
        title: "Walk",
        categoryId: category.id,
      },
    });

    await request(app)
      .post(`/api/habits/${habit.id}/logs`)
      .send({
        date: "2026-06-10",
        timezone: "Europe/Helsinki",
      })
      .expect(201);

    const response = await request(app)
      .delete(`/api/habits/${habit.id}/logs/2026-06-10?timezone=Europe/Helsinki`)
      .expect(200);

    expect(response.body.logs).toHaveLength(0);
    expect(response.body.currentStreak).toBe(0);
    expect(response.body.bestStreak).toBe(0);
  });

  it("returns 400 when deleting a habit log with invalid timezone", async () => {
    const response = await request(app)
      .delete("/api/habits/1/logs/2026-06-10?timezone=Invalid/Timezone")
      .expect(400);

    expect(response.body).toEqual({
      code: "INVALID_TIMEZONE",
      message: "Invalid timezone",
    });
  });

  it.each(["abc", "0", "-1", "1.5"])(
    "returns 400 when deleting habit log with invalid habit id %s",
    async (id) => {
      const response = await request(app)
        .delete(`/api/habits/${id}/logs/2026-06-10`)
        .expect(400);

      expectErrorResponse(
        response,
        "INVALID_HABIT_ID",
        "Valid habit id is required"
      );
    }
  );

  it("returns 400 when deleting a habit log with invalid date", async () => {
    const response = await request(app)
      .delete("/api/habits/1/logs/2026-02-31")
      .expect(400);

    expectErrorResponse(response, "INVALID_DATE", "Invalid date");
  });

  it("returns 404 when deleting a habit log for a missing habit", async () => {
    const response = await request(app)
      .delete("/api/habits/999999/logs/2026-06-10")
      .expect(404);

    expectErrorResponse(response, "HABIT_NOT_FOUND", "Habit not found");
  });

  it("returns 404 when deleting a missing habit log", async () => {
    const habit = await createHabit("Walk");

    const response = await request(app)
      .delete(`/api/habits/${habit.id}/logs/2026-06-10`)
      .expect(404);

    expectErrorResponse(response, "LOG_NOT_FOUND", "Log not found");
  });
});
