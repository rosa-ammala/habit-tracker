import { useState } from "react";
import { getApiErrorMessage } from "../../utils/apiError";
import { isDateInFuture } from "../../utils/date";
import {
  useAddHabitLogMutation,
  useDeleteHabitLogMutation,
} from "./habitsApi";

type ToggleHabitLogInput = {
  habitId: number;
  date: string;
  nextChecked: boolean;
};

export function useToggleHabitLog() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [addHabitLog] = useAddHabitLogMutation();
  const [deleteHabitLog] = useDeleteHabitLogMutation();

  async function toggleHabitLog({
    habitId,
    date,
    nextChecked,
  }: ToggleHabitLogInput) {
    if (isDateInFuture(date)) {
      return;
    }

    try {
      setErrorMessage(null);

      if (nextChecked) {
        await addHabitLog({
          habitId,
          date,
        }).unwrap();

        return;
      }

      await deleteHabitLog({
        habitId,
        date,
      }).unwrap();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Could not update habit log."));
      throw error;
    }
  }

  return {
    logErrorMessage: errorMessage,
    toggleHabitLog,
  };
}
