import type { Category } from "./category";

export type HabitLog = {
  id: number;
  habitId: number;
  date: string;
};

export type Habit = {
  id: number;
  title: string;
  categoryId: number;
  category: Category;
  logs: HabitLog[];
  currentStreak: number;
  bestStreak: number;
  createdAt: string;
};