import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { DeleteHabitModal } from "../components/modals/DeleteHabitModal";
import { DayCell } from "../components/DayCell";
import { EditHabitModal } from "../components/modals/EditHabitModal";
import { IconButton } from "../components/buttons/IconButton";
import { useGetCategoriesQuery } from "../features/categories/categoriesApi";
import { useGetHabitByIdQuery } from "../features/habits/habitsApi";
import { useToggleHabitLog } from "../features/habits/useToggleHabitLog";
import {
  openDeleteHabitModal,
  openEditHabitModal,
} from "../features/ui/uiSlice";
import {
  DISPLAY_DATE_LOCALE,
  getDatesForView,
  getTodayDateOnly,
  isDateInFuture,
  isSameMonth,
} from "../utils/date";
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
  const { logErrorMessage, toggleHabitLog } = useToggleHabitLog();
  const today = getTodayDateOnly();
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const selectedHabitId = useAppSelector((state) => state.ui.selectedHabitId);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesQueryError,
  } = useGetCategoriesQuery();

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
      <main className="min-h-screen bg-indigo-100 px-4 py-5 text-stone-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="text-sm font-semibold text-stone-700">
            Back
          </Link>
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            Invalid habit id.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-indigo-100 px-4 py-5 text-stone-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="rounded-lg bg-white/82 px-4 py-5 text-sm text-stone-500 shadow-sm">
            Loading habit...
          </p>
        </div>
      </main>
    );
  }

  if (isError || !habit) {
    return (
      <main className="min-h-screen bg-indigo-100 px-4 py-5 text-stone-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="text-sm font-semibold text-stone-700">
            Back
          </Link>
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
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

  return (
    <main className="min-h-screen bg-indigo-100 px-4 py-5 text-stone-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Actions - back, edit and delete */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <IconButton
            as="link"
            to="/"
            icon="/ui-icons/arrow-left.svg"
            title="Back"
            showTitle
          />

          <div className="flex gap-2">
            <IconButton
              icon="/ui-icons/edit.svg"
              title="Edit"
              showTitle
              onClick={() => dispatch(openEditHabitModal(selectedHabit.id))}
              disabled={categoriesLoading || categoriesError}
              tooltip={
                categoriesError
                  ? getApiErrorMessage(
                      categoriesQueryError,
                      "Could not load categories."
                    )
                  : undefined
              }
            />

            <IconButton
              icon="/ui-icons/delete.svg"
              title="Delete"
              showTitle
              variant="danger"
              onClick={() => dispatch(openDeleteHabitModal(selectedHabit.id))}
            />
          </div>
        </div>

        {/* Habit Details */}
        <section className="mb-6 rounded-lg border border-white/70 bg-white/82 p-5 shadow-sm shadow-stone-200/70 backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
                Year overview
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-stone-950">
                {selectedHabit.title}
              </h1>
              <div className="mt-1 flex items-center gap-2 text-base text-stone-500">
                <img
                  src={`/category-icons/${selectedHabit.category.icon}`}
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                />
                <span>{selectedHabit.category.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-indigo-50 px-5 py-4 text-center ring-1 ring-indigo-100">
                <p className="text-indigo-700">Current streak</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-2xl font-semibold leading-none text-indigo-700">
                    {selectedHabit.currentStreak}
                  </span>
                  <img
                    src="/ui-icons/fire.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 translate-y-0.5"
                  />
                </div>
                <p className="text-indigo-700">days</p>
              </div>
              <div className="rounded-lg bg-amber-50 px-5 py-4 text-center ring-1 ring-amber-100">
                <p className="text-amber-700">Best streak</p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <span className="text-2xl font-semibold leading-none text-amber-950">
                    {selectedHabit.bestStreak}
                  </span>
                  <img
                    src="/ui-icons/fire.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 translate-y-0.5"
                  />
                </div>
                <p className="text-amber-700">days</p>
              </div>
            </div>
          </div>
        </section>

        {/* Year Overview */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <IconButton
              icon="/ui-icons/arrow-left.svg"
              title="Previous year"
              onClick={() => setVisibleYear((year) => year - 1)}
            />

            <h2 className="px-5 py-2 text-sm font-semibold text-stone-800">
              {visibleYear}
            </h2>

            <IconButton
              icon="/ui-icons/arrow-right.svg"
              title="Next year"
              onClick={() =>
                setVisibleYear((year) => Math.min(year + 1, currentYear))
              }
              disabled={isNextYearDisabled}
            />
          </div>

          {logErrorMessage && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
              {logErrorMessage}
            </p>
          )}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {months.map((month) => {
              const monthDate = `${visibleYear}-${String(month + 1).padStart(2, "0")}-01`;
              const {
                dates,
                month: calendarMonth,
                year: calendarYear,
              } = getDatesForView(monthDate, "month");
              const monthName = new Date(
                visibleYear,
                month,
                1
              ).toLocaleDateString(DISPLAY_DATE_LOCALE, { month: "long" });

              return (
                <div
                  key={month}
                  className="rounded-xl border-2 border-transparent bg-white p-3 shadow"
                >
                  <h3 className="mb-2 text-center text-sm font-semibold text-stone-800">
                    {monthName}
                  </h3>

                  <div className="mb-2 grid grid-cols-7 justify-items-center gap-2 text-center text-xs font-medium text-stone-500">
                    {weekDays.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 justify-items-center gap-2">
                    {dates.map((date) => {
                      const isChecked = logDates.has(date);
                      const isToday = date === today;
                      const isFuture = isDateInFuture(date);
                      const isOutsideMonth = !isSameMonth(
                        date,
                        calendarMonth,
                        calendarYear
                      );

                      if (isOutsideMonth) {
                        return (
                          <div
                            key={date}
                            aria-hidden="true"
                            className="h-8 w-8 min-h-[32px] min-w-[32px]"
                          />
                        );
                      }

                      return (
                        <DayCell
                          key={date}
                          date={date}
                          isChecked={isChecked}
                          isToday={isToday}
                          isFuture={isFuture}
                          isDimmed={false}
                          showNumber
                          onClick={(nextChecked) =>
                            toggleHabitLog({
                              habitId: selectedHabit.id,
                              date,
                              nextChecked,
                            })
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
