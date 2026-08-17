import type { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import * as habitService from "../services/habit.service";
import {
  createHabitBodySchema,
  habitIdParamsSchema,
  habitLogBodySchema,
  habitLogParamsSchema,
  timezoneQuerySchema,
  updateHabitBodySchema,
} from "../validation/habits.validation";
import { parseRequest } from "../validation/parseRequest";

export const getHabits = asyncHandler(
  async (req: Request, res: Response) => {
    const { timezone } = parseRequest(timezoneQuerySchema, req.query);

    const habits = await habitService.getHabits(timezone);

    res.json(habits);
  },
  "Error fetching habits"
);

export const createHabit = asyncHandler(
  async (req: Request, res: Response) => {
    const body = parseRequest(createHabitBodySchema, req.body);

    const habit = await habitService.createHabit(body);

    res.status(201).json(habit);
  },
  "Error creating habit"
);

export const getHabitById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = parseRequest(habitIdParamsSchema, req.params);
    const { timezone } = parseRequest(timezoneQuerySchema, req.query);

    const habit = await habitService.getHabitById(id, timezone);

    res.json(habit);
  },
  "Error fetching habit"
);

export const updateHabit = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = parseRequest(habitIdParamsSchema, req.params);
    const body = parseRequest(updateHabitBodySchema, req.body);

    const habit = await habitService.updateHabit(id, body);

    res.json(habit);
  },
  "Error updating habit"
);

export const deleteHabit = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = parseRequest(habitIdParamsSchema, req.params);

    await habitService.deleteHabit(id);

    res.json({ message: "Habit deleted" });
  },
  "Error deleting habit"
);

// LOGS
export const addHabitLog = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = parseRequest(habitIdParamsSchema, req.params);
    const body = parseRequest(habitLogBodySchema, req.body);

    const habit = await habitService.addHabitLog(id, body);

    res.status(201).json(habit);
  },
  "Error adding habit log"
);

export const deleteHabitLog = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, date } = parseRequest(habitLogParamsSchema, req.params);
    const { timezone } = parseRequest(timezoneQuerySchema, req.query);

    const habit = await habitService.deleteHabitLog(id, date, timezone);

    res.json(habit);
  },
  "Error deleting habit log"
);
