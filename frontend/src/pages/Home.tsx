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

export function Home() {
  const dispatch = useAppDispatch();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const selectedCategory = useAppSelector(
    (state) => state.ui.selectedCategory
  );
  const isCreateHabitModalOpen = useAppSelector(
    (state) => state.ui.isCreateHabitModalOpen
  );
  const editingHabitId = useAppSelector((state) => state.ui.editingHabitId);
  const deletingHabitId = useAppSelector((state) => state.ui.deletingHabitId);

  const {
    data: habits = [],
    isLoading: habitsLoading,
    isError: habitsError,
  } = useGetHabitsQuery();

  const filteredHabits =
    selectedCategory === "All"
      ? habits
      : habits.filter((habit) => habit.category.name === selectedCategory);

  const editingHabit =
    editingHabitId === null
      ? undefined
      : habits.find((habit) => habit.id === editingHabitId);

  const deletingHabit =
    deletingHabitId === null
      ? undefined
      : habits.find((habit) => habit.id === deletingHabitId);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Habit Tracker v2
        </h1>

        <ViewSwitch />
        <DateNavigation />

        {!habitsLoading && !habitsError && (
          <CompletionSummary habits={filteredHabits} />
        )}

        {categoriesLoading && (
          <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Loading categories...</p>
          </section>
        )}

        {categoriesError && (
          <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm text-red-600">Could not load categories.</p>
          </section>
        )}

        {!categoriesLoading && !categoriesError && (
          <CategoryFilter categories={categories} />
        )}

        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={() => dispatch(openCreateHabitModal())}
            disabled={categoriesLoading || categoriesError}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Add habit
          </button>
        </div>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-medium text-gray-700">
            Habits
          </h2>

          {habitsLoading && (
            <p className="text-sm text-gray-500">Loading habits...</p>
          )}

          {habitsError && (
            <p className="text-sm text-red-600">Could not load habits.</p>
          )}

          {!habitsLoading && !habitsError && (
            <HabitList habits={filteredHabits} />
          )}
        </section>

        {isCreateHabitModalOpen && !categoriesLoading && !categoriesError && (
          <CreateHabitModal categories={categories} />
        )}

        {editingHabit && !categoriesLoading && !categoriesError && (
          <EditHabitModal habit={editingHabit} categories={categories} />
        )}

        {deletingHabit && (
          <DeleteHabitModal habit={deletingHabit} />
        )}
      </div>
    </main>
  );
}
