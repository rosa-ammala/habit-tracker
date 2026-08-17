import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../app";
import { prisma } from "../config/prisma";
import { getTodayInTimezone } from "../utils/date";

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
});
