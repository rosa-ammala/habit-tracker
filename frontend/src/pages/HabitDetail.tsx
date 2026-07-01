import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { DeleteHabitModal } from "../components/DeleteHabitModal";
import { EditHabitModal } from "../components/EditHabitModal";
import { useGetCategoriesQuery } from "../features/categories/categoriesApi";
import {
  useAddHabitLogMutation,
  useDeleteHabitLogMutation,
  useGetHabitByIdQuery,
} from "../features/habits/habitsApi";
import {
  openDeleteHabitModal,
  openEditHabitModal,
} from "../features/ui/uiSlice";
import { getMonthOnlyDates, getTodayDateOnly, isDateInFuture } from "../utils/date";

const months = Array.from({ length: 12 }, (_, index) => index);
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitDetail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const habitId = Number(id);
  const currentYear = new Date().getFullYear();
  const today = getTodayDateOnly();
  const editingHabitId = useAppSelector((state) => state.ui.editingHabitId);
  const deletingHabitId = useAppSelector((state) => state.ui.deletingHabitId);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();

  const [addHabitLog, { isLoading: isAddingLog }] = useAddHabitLogMutation();
  const [deleteHabitLog, { isLoading: isDeletingLog }] =
    useDeleteHabitLogMutation();
  const isUpdatingLog = isAddingLog || isDeletingLog;

  const {
    data: habit,
    isLoading,
    isError,
  } = useGetHabitByIdQuery(habitId, {
    skip: !Number.isInteger(habitId),
  });

  if (!Number.isInteger(habitId)) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="text-sm font-medium text-gray-700">
            Back
          </Link>
          <p className="mt-6 text-sm text-red-600">Invalid habit id.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-gray-500">Loading habit...</p>
        </div>
      </main>
    );
  }

  if (isError || !habit) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="text-sm font-medium text-gray-700">
            Back
          </Link>
          <p className="mt-6 text-sm text-red-600">Could not load habit.</p>
        </div>
      </main>
    );
  }

  const selectedHabit = habit;
  const logDates = new Set(selectedHabit.logs.map((log) => log.date));
  const isEditModalOpen = editingHabitId === selectedHabit.id;
  const isDeleteModalOpen = deletingHabitId === selectedHabit.id;

  async function handleToggleDate(date: string) {
    if (isDateInFuture(date) || isUpdatingLog) {
      return;
    }

    const isChecked = logDates.has(date);

    if (isChecked) {
      await deleteHabitLog({
        habitId: selectedHabit.id,
        date,
      }).unwrap();

      return;
    }

    await addHabitLog({
      habitId: selectedHabit.id,
      date,
    }).unwrap();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200"
          >
            Back
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => dispatch(openEditHabitModal(selectedHabit.id))}
              disabled={categoriesLoading || categoriesError}
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 disabled:opacity-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => dispatch(openDeleteHabitModal(selectedHabit.id))}
              className="rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white"
            >
              Delete
            </button>
          </div>
        </div>

        <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {selectedHabit.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {selectedHabit.category.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-gray-50 px-4 py-3 text-center ring-1 ring-gray-200">
                <p className="text-gray-500">Current</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {selectedHabit.currentStreak}
                </p>
              </div>
              <div className="rounded-md bg-gray-50 px-4 py-3 text-center ring-1 ring-gray-200">
                <p className="text-gray-500">Best</p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {selectedHabit.bestStreak}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-medium text-gray-700">
            {currentYear}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {months.map((month) => {
              const monthDate = `${currentYear}-${String(month + 1).padStart(2, "0")}-01`;
              const dates = getMonthOnlyDates(monthDate);
              const monthName = new Date(currentYear, month, 1).toLocaleDateString(
                "en-GB",
                { month: "long" }
              );

              return (
                <div
                  key={month}
                  className="rounded-md border border-gray-200 bg-gray-50 p-3"
                >
                  <h3 className="mb-2 text-center text-sm font-medium text-gray-800">
                    {monthName}
                  </h3>

                  <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
                    {weekDays.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {dates.map((date) => {
                      const isChecked = logDates.has(date);
                      const isToday = date === today;
                      const isFuture = isDateInFuture(date);

                      return (
                        <button
                          type="button"
                          key={date}
                          title={date}
                          disabled={isFuture || isUpdatingLog}
                          onClick={() => handleToggleDate(date)}
                          className={[
                            "flex h-7 w-7 items-center justify-center rounded text-xs ring-1",
                            isChecked
                              ? "bg-green-700 text-white ring-green-700"
                              : "bg-white text-gray-700 ring-gray-200",
                            isToday && !isChecked ? "ring-2 ring-gray-900" : "",
                            isFuture || isUpdatingLog
                              ? "cursor-not-allowed opacity-25"
                              : "hover:bg-gray-100",
                          ].join(" ")}
                        >
                          {Number(date.slice(-2))}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {isEditModalOpen && !categoriesLoading && !categoriesError && (
        <EditHabitModal habit={selectedHabit} categories={categories} />
      )}

      {isDeleteModalOpen && (
        <DeleteHabitModal
          habit={selectedHabit}
          onDeleted={() => navigate("/")}
        />
      )}
    </main>
  );
}
