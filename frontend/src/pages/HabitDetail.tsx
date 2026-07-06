import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { DeleteHabitModal } from "../components/DeleteHabitModal";
import { DayCell } from "../components/DayCell";
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
import { getApiErrorMessage } from "../utils/apiError";

const months = Array.from({ length: 12 }, (_, index) => index);
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HabitDetail() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const habitId = Number(id);
  const currentYear = new Date().getFullYear();
  const [visibleYear, setVisibleYear] = useState(currentYear);
  const [logErrorMessage, setLogErrorMessage] = useState<string | null>(null);
  const today = getTodayDateOnly();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const selectedHabitId = useAppSelector((state) => state.ui.selectedHabitId);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesQueryError,
  } = useGetCategoriesQuery();

  const [addHabitLog] = useAddHabitLogMutation();
  const [deleteHabitLog] = useDeleteHabitLogMutation();

  const {
    data: habit,
    isLoading,
    isError,
    error,
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
          <p className="mt-6 text-sm text-red-600">
            {getApiErrorMessage(error, "Could not load habit.")}
          </p>
        </div>
      </main>
    );
  }

  const selectedHabit = habit;
  const logDates = new Set(selectedHabit.logs.map((log) => log.date));
  const isEditModalOpen =
    activeModal === "edit" && selectedHabitId === selectedHabit.id;
  const isDeleteModalOpen =
    activeModal === "delete" && selectedHabitId === selectedHabit.id;
  const isNextYearDisabled = visibleYear >= currentYear;

  async function handleToggleDate(date: string, nextChecked: boolean) {
    if (isDateInFuture(date)) {
      return;
    }

    try {
      setLogErrorMessage(null);

      if (nextChecked) {
        await addHabitLog({
          habitId: selectedHabit.id,
          date,
        }).unwrap();

        return;
      }

      await deleteHabitLog({
        habitId: selectedHabit.id,
        date,
      }).unwrap();
    } catch (error) {
      setLogErrorMessage(
        getApiErrorMessage(error, "Could not update habit log.")
      );
      throw error;
    }
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
              title={
                categoriesError
                  ? getApiErrorMessage(
                      categoriesQueryError,
                      "Could not load categories."
                    )
                  : undefined
              }
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
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setVisibleYear((year) => year - 1)}
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200"
            >
              Previous year
            </button>

            <h2 className="text-sm font-medium text-gray-700">
              {visibleYear}
            </h2>

            <button
              type="button"
              onClick={() =>
                setVisibleYear((year) => Math.min(year + 1, currentYear))
              }
              disabled={isNextYearDisabled}
              className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next year
            </button>
          </div>

          {logErrorMessage && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {logErrorMessage}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {months.map((month) => {
              const monthDate = `${visibleYear}-${String(month + 1).padStart(2, "0")}-01`;
              const dates = getMonthOnlyDates(monthDate);
              const monthName = new Date(visibleYear, month, 1).toLocaleDateString(
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
                        <DayCell
                          key={date}
                          date={date}
                          isChecked={isChecked}
                          isToday={isToday}
                          isFuture={isFuture}
                          isDimmed={false}
                          showNumber
                          size="sm"
                          onClick={(nextChecked) =>
                            handleToggleDate(date, nextChecked)
                          }
                        />
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
