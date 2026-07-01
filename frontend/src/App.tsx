import { CreateHabitForm } from "./components/CreateHabitForm";
import { HabitList } from "./components/HabitList";
import { ViewSwitch } from "./components/ViewSwitch";
import { DateNavigation } from "./components/DateNavigation";
import { CompletionSummary } from "./components/CompletionSummary";
import { useAppSelector } from "./app/hooks";
import { CategoryFilter } from "./components/CategoryFilter";
import { useGetCategoriesQuery } from "./features/categories/categoriesApi";
import { useGetHabitsQuery } from "./features/habits/habitsApi";

function App() {
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const selectedCategory = useAppSelector(
    (state) => state.ui.selectedCategory
  );
  
  const {
    data: habits = [],
    isLoading: habitsLoading,
    isError: habitsError,
  } = useGetHabitsQuery();

  const filteredHabits =
    selectedCategory === "All"
      ? habits
      : habits.filter((habit) => habit.category.name === selectedCategory);
      
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

        <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-medium text-gray-700">
            Categories
          </h2>

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
        </section>

        {!categoriesLoading && !categoriesError && (
          <CreateHabitForm categories={categories} />
        )}

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
            <HabitList habits={filteredHabits} categories={categories} />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;