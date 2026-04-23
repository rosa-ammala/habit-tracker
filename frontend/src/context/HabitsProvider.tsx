import { useEffect, useState } from "react";
import type { Habit } from "../types/habit";
import { getHabits } from "../api/habits";
import { HabitsContext } from "./HabitsContext";


export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHabits();
  }, []);

  return (
    <HabitsContext.Provider
      value={{ habits, setHabits, loading, refetch: fetchHabits }}
    >
      {children}
    </HabitsContext.Provider>
  );
}