import type { Category } from "./category";

export type Habit = {
  id: number;
  title: string;
  createdAt: string;

  categoryId: number;
  category: Category;

  logs: HabitLog[];

  currentStreak: number;
  bestStreak: number;
};

export type HabitLog = {
  id: number;
  habitId: number;
  date: string;
};