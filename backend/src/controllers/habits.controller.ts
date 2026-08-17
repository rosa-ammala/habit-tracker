import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../middleware/errors";
import * as habitService from "../services/habit.service";

export const getHabits = asyncHandler(
  async (req: Request, res: Response) => {
    const timezone =
      typeof req.query.timezone === "string" ? req.query.timezone : "UTC";

    const habits = await habitService.getHabits(timezone);

    res.json(habits);
  },
  "Error fetching habits"
);

export const createHabit = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, categoryId } = req.body;

    if (!title || typeof title !== "string") {
      throw new AppError(400, "Title is required");
    }

    const parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedCategoryId)) {
      throw new AppError(400, "Valid categoryId is required");
    }

    const habit = await habitService.createHabit({
      title: title.trim(),
      categoryId: parsedCategoryId,
    });

    res.status(201).json(habit);
  },
  "Error creating habit"
);

export const getHabitById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError(400, "Valid habit id is required");
    }

    const timezone =
      typeof req.query.timezone === "string" ? req.query.timezone : "UTC";

    const habit = await habitService.getHabitById(id, timezone);

    res.json(habit);
  },
  "Error fetching habit"
);

export const updateHabit = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError(400, "Valid habit id is required");
    }

    const { title, categoryId } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      throw new AppError(400, "Title is required");
    }

    const parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedCategoryId)) {
      throw new AppError(400, "Valid categoryId is required");
    }

    const habit = await habitService.updateHabit(id, {
      title: title.trim(),
      categoryId: parsedCategoryId,
    });

    res.json(habit);
  },
  "Error updating habit"
);

export const deleteHabit = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError(400, "Valid habit id is required");
    }

    await habitService.deleteHabit(id);

    res.json({ message: "Habit deleted" });
  },
  "Error deleting habit"
);

// LOGS
export const addHabitLog = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      throw new AppError(400, "Valid habit id is required");
    }

    const { date, timezone } = req.body;

    if (!date || typeof date !== "string") {
      throw new AppError(400, "Date is required");
    }

    if (!timezone || typeof timezone !== "string") {
      throw new AppError(400, "Timezone is required");
    }

    const habit = await habitService.addHabitLog(id, {
      date,
      timezone,
    });

    res.status(201).json(habit);
  },
  "Error adding habit log"
);

export const deleteHabitLog = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const date = req.params.date;

    if (!Number.isInteger(id)) {
      throw new AppError(400, "Valid habit id is required");
    }

    if (typeof date !== "string") {
      throw new AppError(400, "Valid date is required");
    }

    const timezone =
      typeof req.query.timezone === "string" ? req.query.timezone : "UTC";

    const habit = await habitService.deleteHabitLog(id, date, timezone);

    res.json(habit);
  },
  "Error deleting habit log"
);
