import type { Request, Response } from "express";
import * as habitService from "../services/habit.service";

export async function getHabits(_req: Request, res: Response) {
  try {
    const habits = await habitService.getHabits();
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching habits" });
  }
}

export async function createHabit(req: Request, res: Response) {
  try {
    const { title, categoryId } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title is required" });
    }

    const parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedCategoryId)) {
      return res.status(400).json({ message: "Valid categoryId is required" });
    }

    const habit = await habitService.createHabit({
      title: title.trim(),
      categoryId: parsedCategoryId,
    });

    res.status(201).json(habit);
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }

    console.error(error);
    res.status(500).json({ message: "Error creating habit" });
  }
}

export async function getHabitById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    const habit = await habitService.getHabitById(id);

    res.json(habit);
  } catch (error) {
    if (error instanceof Error && error.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ message: "Habit not found" });
    }

    console.error(error);
    res.status(500).json({ message: "Error fetching habit" });
  }
}

export async function updateHabit(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    const { title, categoryId } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const parsedCategoryId = Number(categoryId);

    if (!Number.isInteger(parsedCategoryId)) {
      return res.status(400).json({ message: "Valid categoryId is required" });
    }

    const habit = await habitService.updateHabit(id, {
      title: title.trim(),
      categoryId: parsedCategoryId,
    });

    res.json(habit);
  } catch (error) {
    if (error instanceof Error && error.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (error instanceof Error && error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }

    console.error(error);
    res.status(500).json({ message: "Error updating habit" });
  }
}

export async function deleteHabit(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    await habitService.deleteHabit(id);

    res.json({ message: "Habit deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "HABIT_NOT_FOUND") {
      return res.status(404).json({ message: "Habit not found" });
    }

    console.error(error);
    res.status(500).json({ message: "Error deleting habit" });
  }
}