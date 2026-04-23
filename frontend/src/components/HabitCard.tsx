import { useNavigate } from "react-router-dom";
import type { Habit } from "../types/habit";
import type { View } from "../types/view";
import { calculateStreak } from "../utils/streak";
import { DayCell } from "./DayCell";

import fireIcon from "../assets/fire.svg";
import { getTodayString, parseDateString } from "../utils/date";
import { useToggleHabitLog } from "../hooks/useToggleHabitLog";

type Props = {
  habit: Habit;
  selectedDates: string[];
  view: View;
  currentMonth: number;
  currentYear: number;
  onLogsChange: (habitId: number, updatedLogs: string[]) => void;
};

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitCard({
  habit,
  selectedDates,
  view,
  currentMonth,
  currentYear,
  onLogsChange,
}: Props) {
  const navigate = useNavigate();
  const { logs, handleToggle } = useToggleHabitLog(habit, onLogsChange);

  const streak = calculateStreak(logs);
  const todayStr = getTodayString();

  return (
    <div
      onClick={() => navigate(`/habit/${habit.id}`)}
      className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 border-2 border-transparent hover:border-gray-300 cursor-pointer transition"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">{habit.title}</h2>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <img src={`/${habit.category.icon}`} className="w-4 h-4" />
            <span>{habit.category.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-semibold">{streak}</span>
          <img src={fireIcon} className="w-4 h-4" />
        </div>
      </div>

      {/* WEEKDAY HEADER */}
      {(view === "month" || view === "week") && (
        <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 text-center justify-items-center">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
      )}

      {/* GRID */}
      <div
        className={
          view === "day"
            ? "flex justify-center"
            : "grid grid-cols-7 gap-2 justify-items-center"
        }
      >
        {selectedDates.map((date) => {
          const isChecked = logs.includes(date);
          const parsedDate = parseDateString(date);
          const dayNumber = parsedDate.getDate();

          const isDimmed =
            view === "month" &&
            (parsedDate.getMonth() !== currentMonth ||
              parsedDate.getFullYear() !== currentYear);

          const isToday = date === todayStr;
          const isFuture = date > todayStr;

          return (
            <DayCell
              key={date}
              isChecked={isChecked}
              isToday={isToday}
              isDimmed={isDimmed}
              isDisabled={isFuture}
              showNumber={view === "month" || view === "week"}
              dayNumber={dayNumber}
              onClick={(event) => {
                event.stopPropagation();
                handleToggle(date);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}