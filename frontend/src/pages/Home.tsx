import { HabitList } from "../components/HabitList";
import { ViewSwitch } from "../components/ViewSwitch";
import { DateNavigation } from "../components/DateNavigation";
import { CompletionSummary } from "../components/CompletionSummary";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { CategoryFilter } from "../components/CategoryFilter";
import { useGetCategoriesQuery } from "../features/categories/categoriesApi";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import { CreateHabitModal } from "../components/CreateHabitModal";
import { openCreateHabitModal } from "../features/ui/uiSlice";
import { EditHabitModal } from "../components/EditHabitModal";
import { DeleteHabitModal } from "../components/DeleteHabitModal";
import { getApiErrorMessage } from "../utils/apiError";

export function Home() {
  const dispatch = useAppDispatch();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesQueryError,
  } = useGetCategoriesQuery();

  const selectedCategory = useAppSelector(
    (state) => state.ui.selectedCategory
  );
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const selectedHabitId = useAppSelector((state) => state.ui.selectedHabitId);

  const {
    data: habits = [],
    isLoading: habitsLoading,
    isError: habitsError,
    error: habitsQueryError,
  } = useGetHabitsQuery();

  const filteredHabits =
    selectedCategory === "All"
      ? habits
      : habits.filter((habit) => habit.category.name === selectedCategory);

  const editingHabit =
    activeModal !== "edit" || selectedHabitId === null
      ? undefined
      : habits.find((habit) => habit.id === selectedHabitId);

  const deletingHabit =
    activeModal !== "delete" || selectedHabitId === null
      ? undefined
      : habits.find((habit) => habit.id === selectedHabitId);

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

          <button
            type="button"
            onClick={() => dispatch(openCreateHabitModal())}
            disabled={categoriesLoading || categoriesError}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-transparent bg-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 hover:border-gray-300 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <img
              src="/ui-icons/add.svg"
              alt=""
              aria-hidden="true"
              className="mr-2 h-5 w-5 shrink-0"
            />
            Add habit
          </button>
        </header>

        <section className="mb-6 space-y-6">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2">
            <div className="flex w-full justify-center">
              <ViewSwitch />
            </div>

            <div className="flex w-full justify-center">
              <DateNavigation />
            </div>
          </div>

          {!habitsLoading && !habitsError && (
            <CompletionSummary habits={filteredHabits} />
          )}
        </section>

        {categoriesLoading && (
          <section className="mb-6 rounded-lg border border-stone-200 bg-white/82 p-4 shadow-sm">
            <p className="text-sm text-stone-500">Loading categories...</p>
          </section>
        )}

        {categoriesError && (
          <section className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
            <p className="text-sm text-red-700">
              {getApiErrorMessage(
                categoriesQueryError,
                "Could not load categories."
              )}
            </p>
          </section>
        )}

        {!categoriesLoading && !categoriesError && (
          <CategoryFilter categories={categories} />
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
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {getApiErrorMessage(habitsQueryError, "Could not load habits.")}
            </p>
          )}

          {!habitsLoading && !habitsError && (
            <HabitList habits={filteredHabits} />
          )}
        </section>

        {activeModal === "create" && !categoriesLoading && !categoriesError && (
          <CreateHabitModal categories={categories} />
        )}

        {editingHabit && !categoriesLoading && !categoriesError && (
          <EditHabitModal habit={editingHabit} categories={categories} />
        )}

        {deletingHabit && <DeleteHabitModal habit={deletingHabit} />}
      </div>
    </main>
  );
}
