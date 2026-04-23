import { useContext } from "react";
import { HabitsContext, type HabitsContextType } from "../context/HabitsContext";

export function useHabits(): HabitsContextType {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }
  return context;
}