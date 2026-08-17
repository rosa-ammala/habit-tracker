import { useState } from "react";
import { HabitList } from "../components/HabitList";
import { ViewSwitch } from "../components/ViewSwitch";
import { DateNavigation } from "../components/DateNavigation";
import { CompletionSummary } from "../components/CompletionSummary";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CategoryFilter } from "../components/CategoryFilter";
import { useGetCategoriesQuery } from "../features/categories/categoriesApi";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import { CreateHabitModal } from "../components/modals/CreateHabitModal";
import { ErrorBanner } from "../components/ErrorBanner";
import {
  openCreateHabitModal,
  setSelectedDate,
  setSelectedView,
} from "../features/ui/uiSlice";
import { IconButton } from "../components/buttons/IconButton";
import { getApiErrorMessage } from "../utils/apiError";

export function Home() {
  const dispatch = useAppDispatch();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesQueryError,
  } = useGetCategoriesQuery();

  const {
    data: habits = [],
    isLoading: habitsLoading,
    isError: habitsError,
    error: habitsQueryError,
  } = useGetHabitsQuery();

  const selectedDate = useAppSelector((state) => state.ui.selectedDate);
  const selectedView = useAppSelector((state) => state.ui.selectedView);
  const activeModal = useAppSelector((state) => state.ui.activeModal);

  const filteredHabits =
    selectedCategoryId === null
      ? habits
      : habits.filter((habit) => habit.categoryId === selectedCategoryId);

  return (
    <main className="min-h-screen bg-indigo-100 px-4 py-5 text-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-col gap-5 rounded-xl border-2 border-transparent bg-white p-5 shadow sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">
              Daily rhythm
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-950 sm:text-4xl">
              Habit Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Track the habits that matter today, this week, and across the month.
            </p>
          </div>

          <IconButton
            icon="/ui-icons/add.svg"
            title="Add habit"
            showTitle
            variant="primary"
            onClick={() => dispatch(openCreateHabitModal())}
            disabled={categoriesLoading || categoriesError}
          />
        </header>

        <section className="mb-6 space-y-6">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2">
            <div className="flex w-full justify-center">
              <ViewSwitch
                selectedView={selectedView}
                onSelectedViewChange={(view) => dispatch(setSelectedView(view))}
              />
            </div>

            <div className="flex w-full justify-center">
              <DateNavigation
                selectedDate={selectedDate}
                selectedView={selectedView}
                onSelectedDateChange={(date) => dispatch(setSelectedDate(date))}
              />
            </div>
          </div>

          {!habitsLoading && !habitsError && (
            <CompletionSummary
              habits={filteredHabits}
              selectedDate={selectedDate}
              selectedView={selectedView}
            />
          )}
        </section>

        {categoriesLoading && (
          <section className="mb-6 rounded-lg border border-stone-200 bg-white/82 p-4 shadow-sm">
            <p className="text-sm text-stone-500">Loading categories...</p>
          </section>
        )}

        {categoriesError && (
          <section className="mb-6">
            <ErrorBanner
              message={getApiErrorMessage(
                categoriesQueryError,
                "Could not load categories."
              )}
            />
          </section>
        )}

        {!categoriesLoading && !categoriesError && (
          <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectedCategoryChange={setSelectedCategoryId}
          />
        )}

        <section>
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-semibold text-stone-950">
                Habits
              </h2>
            </div>
          </div>

          {habitsLoading && (
            <p className="rounded-lg bg-stone-50 px-4 py-5 text-sm text-stone-500">
              Loading habits...
            </p>
          )}

          {habitsError && (
            <ErrorBanner
              message={getApiErrorMessage(
                habitsQueryError,
                "Could not load habits."
              )}
            />
          )}

          {!habitsLoading && !habitsError && (
            <HabitList habits={filteredHabits} />
          )}
        </section>

        {activeModal === "create" && !categoriesLoading && !categoriesError && (
          <CreateHabitModal categories={categories} />
        )}

      </div>
    </main>
  );
}
