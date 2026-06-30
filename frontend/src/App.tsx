import { CreateHabitForm } from "./components/CreateHabitForm";
import { HabitList } from "./components/HabitList";
import { ViewSwitch } from "./components/ViewSwitch";
import { DateNavigation } from "./components/DateNavigation";
import { useGetCategoriesQuery } from "./features/categories/categoriesApi";
import { useGetHabitsQuery } from "./features/habits/habitsApi";

function App() {
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const {
    data: habits = [],
    isLoading: habitsLoading,
    isError: habitsError,
  } = useGetHabitsQuery();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Habit Tracker v2
        </h1>

        <ViewSwitch />
        <DateNavigation />

        <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-medium text-gray-700">
            Categories
          </h2>

          {categoriesLoading && (
            <p className="text-sm text-gray-500">Loading categories...</p>
          )}

          {categoriesError && (
            <p className="text-sm text-red-600">Could not load categories.</p>
          )}

          {!categoriesLoading && !categoriesError && (
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
                >
                  {category.name}
                </li>
              ))}
            </ul>
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
            <HabitList habits={habits} categories={categories} />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;