import { useEffect, useState } from "react";
import { useHabits } from "../hooks/useHabits";

import { HabitCard } from "../components/HabitCard";
import { HabitModal } from "../components/HabitModal";
import { Categories } from "../components/Categories";
import { IconButton } from "../components/IconButton";

import { getCategories } from "../api/categories";
import { getCompletionStats } from "../utils/habitStats";
import {
  formatRangeLabel,
  getStartOfMonth,
  getStartOfWeek,
  getTodayString,
} from "../utils/date";

import type { Category } from "../types/category";

import fireIcon from "../assets/fire.svg";
import addIcon from "../assets/add.svg";
import leftArrow from "../assets/arrow_back.svg";
import rightArrow from "../assets/arrow_forward.svg";
import { CompletionCard } from "../components/CompletionCard";
import { ViewSwitch } from "../components/ViewSwitch";
import { useSelectedDates } from "../hooks/useSelectedDates";
import { useDateNavigation } from "../hooks/useDateNavigation";
import type { View } from "../types/view";

export function Home() {
  const { habits, loading, refetch, setHabits } = useHabits();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [view, setView] = useState<View>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { normalizedSelectedDate, selectedDates } = useSelectedDates(view, selectedDate);

  const todayStr = getTodayString();

  const { goNext, goPrev, isNextDisabled } = useDateNavigation(
    view,
    normalizedSelectedDate,
    todayStr
  );

  // FETCH CATEGORIES
  useEffect(() => {
    if (!loading) {
      getCategories()
        .then(setCategories)
        .catch(console.error);
    }
  }, [loading]);


  // FILTER  
  const filteredHabits =
  selectedCategory === "All"
    ? habits
    : habits.filter(
        (habit) => habit.category.name === selectedCategory
      );

  const { completed, percentage } = getCompletionStats(habits);

  const handleLogsChange = (habitId: number, updatedLogs: string[]) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              logs: updatedLogs.map((date, index) => ({
                id: index,
                habitId,
                date,
              })),
            }
          : habit
      )
    );
  };

  const setViewAndAdjustDate = (newView: View) => {
    setView(newView);

    if (newView === "week") {
      setSelectedDate((prev) => getStartOfWeek(prev));
      return;
    }

    if (newView === "month") {
      setSelectedDate((prev) => getStartOfMonth(prev));
      return;
    }
  };

  if (loading) {
    return <div className="p-4 min-h-screen bg-indigo-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-indigo-100 p-4 flex flex-col items-center">
      {/* COMPLETION */}
      <CompletionCard
        completed={completed}
        total={habits.length}
        percentage={percentage}
        icon={fireIcon}
      />

      {/* VIEW SWITCH */}
      <ViewSwitch
        value={view}
        onChange={setViewAndAdjustDate}
      />

      {/* NAV */}
      <div className="flex items-center gap-4 mb-6">
        <IconButton 
          icon={leftArrow} 
          onClick={() => setSelectedDate(goPrev())} 
          size="sm" 
          hasLeftPadding 
        />

        <span className="text-sm font-medium">
          {formatRangeLabel(view, selectedDate)}
        </span>

        <IconButton
          icon={rightArrow}
          onClick={() => !isNextDisabled && setSelectedDate(goNext())}
          size="sm"
          disabled={isNextDisabled}
        />
      </div>

      {/* CATEGORY */}
      <div className="w-full max-w-5xl mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          Categories
        </h2>

        <Categories
          categories={categories}
          selectedValue={selectedCategory}
          onSelect={(value) => setSelectedCategory(value as string)}
          mode="filter"
          includeAll
        />
      </div>

      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-gray-700">
          Your Habits
        </h2>

        <IconButton
          icon={addIcon}
          onClick={() => setIsModalOpen(true)}
          className="bg-white border-2 border-transparent shadow-sm hover:border-gray-300"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
        {filteredHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            selectedDates={selectedDates}
            view={view}
            currentMonth={normalizedSelectedDate.getMonth()}
            currentYear={normalizedSelectedDate.getFullYear()}
            onLogsChange={handleLogsChange}
          />
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <HabitModal
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}