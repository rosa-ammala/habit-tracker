import { createContext } from "react";
import type { Habit } from "../types/habit";

export type HabitsContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  loading: boolean;
  refetch: () => Promise<void>;
};

export const HabitsContext = createContext<HabitsContextType | null>(null);
