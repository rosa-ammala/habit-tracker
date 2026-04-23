import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Habit } from "../types/habit";
import type { Category } from "../types/category";
import { getMonthDates, getTodayString, toDateString } from "../utils/date";
import { calculateStreak, calculateBestStreak } from "../utils/streak";
import { getHabits, deleteHabit } from "../api/habits";
import { getCategories } from "../api/categories";
import { EditHabitModal } from "../components/EditHabitModal";
import { DeleteHabitModal } from "../components/DeleteHabitModal";

import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";
import fireIcon from "../assets/fire.svg";
import leftArrow from "../assets/arrow_back.svg";
import rightArrow from "../assets/arrow_forward.svg";
import { DayCell } from "../components/DayCell";
import { IconButton } from "../components/IconButton";
import { useToggleHabitLogApi } from "../hooks/useToggleHabitLogApi";
import { useHabits } from "../hooks/useHabits";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [habit, setHabit] = useState<Habit | null>(null);
  const { logs, toggleLog } = useToggleHabitLogApi(habit);
  const { setHabits } = useHabits();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const todayStr = getTodayString();

  useEffect(() => {
    const fetchHabit = async () => {
      const data = await getHabits();
      const found = data.find((h: Habit) => h.id === Number(id));
      setHabit(found);
    };

    fetchHabit();
  }, [id]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);
  
  if (!habit) return <div className="p-4 min-h-screen bg-indigo-100">Loading...</div>;

  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  const localStreak = calculateStreak(logs);
  const localBestStreak = calculateBestStreak(logs);

  const handleLogsChange = (dateStr: string) => {
    const updatedLogs = logs.includes(dateStr)
      ? logs.filter((d) => d !== dateStr)
      : [...logs, dateStr];

    toggleLog(dateStr);

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id
          ? {
              ...h,
              logs: updatedLogs.map((date, index) => ({
                id: index,
                habitId: habit.id,
                date,
              })),
            }
          : h
      )
    );
  };

  const handleDelete = async () => {
    if (!habit) return;
  
    try {
      await deleteHabit(habit.id);
      setHabits((prev) => prev.filter((h) => h.id !== habit.id));
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen bg-indigo-100 p-4 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <IconButton icon={leftArrow} onClick={() => navigate(-1)} hasLeftPadding />

        <div className="w-8" />

        <div className="flex gap-2">
          <IconButton icon={editIcon} onClick={() => setIsEditOpen(true)} />
          <IconButton icon={deleteIcon} onClick={() => setIsDeleteOpen(true)} />
        </div>
      </div>

      {/* TOP INFO */}
      <div className="w-full max-w-sm mb-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Habit</span>
          <div className="bg-white px-4 py-3 rounded-lg text-sm w-fit shadow-sm">
            {habit.title}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Category</span>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg w-fit text-sm shadow-sm">
            <img
              src={`/${habit.category.icon}`}
              className="w-6 h-6"
              alt={habit.category.name}
            />
            <span>{habit.category.name}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-700">Streaks</span>

          <div className="flex gap-4 w-full">
            <div className="bg-white rounded-xl px-4 py-3 flex flex-col items-center flex-1 shadow-sm">
              <span className="text-sm text-gray-600 mb-2">Current</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-semibold">
                  {localStreak}
                </span>
                <img src={fireIcon} className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-xl px-4 py-3 flex flex-col items-center flex-1 shadow-sm">
              <span className="text-sm text-gray-600 mb-2">Best</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-semibold">
                  {localBestStreak}
                </span>
                <img src={fireIcon} className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YEAR NAV */}
      <div className="flex items-center gap-4 mb-6">
        <IconButton 
          icon={leftArrow} 
          onClick={() => setYear((y) => y - 1)} 
          size="sm" 
          hasLeftPadding
        />

        <span className="font-medium">{year}</span>

        <IconButton 
          icon={rightArrow} 
          onClick={() => setYear((y) => y + 1)} 
          size="sm" 
          disabled={year >= new Date().getFullYear()} 
        />
      </div>

      {/* YEAR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {months.map((monthDate) => {
          const days = getMonthDates(monthDate);

          return (
            <div
              key={monthDate.getMonth()}
              className="bg-white rounded-xl shadow p-3"
            >
              <h3 className="text-sm font-medium mb-2 text-center">
                {monthDate.toLocaleDateString("en-GB", {
                  month: "long",
                })}
              </h3>

              <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 text-center justify-items-center mb-2">
                {weekDays.map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 justify-items-center">
                {days.map((date) => {
                  const dateStr = toDateString(date);

                  const isChecked = logs.includes(dateStr);
                  const isToday = dateStr === todayStr;
                  const isFuture = dateStr > todayStr;
                  const isDimmed = date.getMonth() !== monthDate.getMonth();

                  return (
                    <DayCell
                      key={dateStr}
                      isChecked={isChecked}
                      isToday={isToday}
                      isDimmed={isDimmed}
                      isDisabled={isFuture}
                      showNumber={true}
                      dayNumber={date.getDate()}
                      onClick={() => handleLogsChange(dateStr)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT HABIT MODAL */}
      {isEditOpen && habit && (
        <EditHabitModal
          categories={categories}
          habit={habit}
          onClose={() => setIsEditOpen(false)}
          onSuccess={getHabits}
        />
      )}

      {/* DELETE HABIT MODAL */}
      {isDeleteOpen && habit && (
        <DeleteHabitModal
          habitTitle={habit.title}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}