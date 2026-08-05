import { apiSlice } from "../api/apiSlice";
import type { AppDispatch } from "../../app/store";
import type { Habit } from "../../types/habit";
import { getUserTimezone } from "../../utils/timezone";

type CreateHabitRequest = {
  title: string;
  categoryId: number;
};

type UpdateHabitRequest = {
  habitId: number;
  title: string;
  categoryId: number;
};

type DeleteHabitRequest = {
  habitId: number;
};

type AddHabitLogRequest = {
  habitId: number;
  date: string;
};

type DeleteHabitLogRequest = {
  habitId: number;
  date: string;
};

export const habitsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHabits: builder.query<Habit[], void>({
      query: () => ({
        url: "/habits",
        params: {
          timezone: getUserTimezone(),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              "Habits",
              ...result.map((habit) => ({
                type: "Habit" as const,
                id: habit.id,
              })),
            ]
          : ["Habits"],
    }),

    getHabitById: builder.query<Habit, number>({
      query: (habitId) => ({
        url: `/habits/${habitId}`,
        params: {
          timezone: getUserTimezone(),
        },
      }),
      providesTags: (_result, _error, habitId) => [
        { type: "Habit", id: habitId },
      ],
    }),

    createHabit: builder.mutation<Habit, CreateHabitRequest>({
      query: (body) => ({
        url: "/habits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Habits"],
    }),

    updateHabit: builder.mutation<Habit, UpdateHabitRequest>({
      query: ({ habitId, title, categoryId }) => ({
        url: `/habits/${habitId}`,
        method: "PATCH",
        body: {
          title,
          categoryId,
        },
      }),
      invalidatesTags: (_result, _error, { habitId }) => [
        "Habits",
        { type: "Habit", id: habitId },
      ],
    }),

    deleteHabit: builder.mutation<{ message: string }, DeleteHabitRequest>({
      query: ({ habitId }) => ({
        url: `/habits/${habitId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { habitId }) => [
        "Habits",
        { type: "Habit", id: habitId },
      ],
    }),

    addHabitLog: builder.mutation<Habit, AddHabitLogRequest>({
      query: ({ habitId, date }) => ({
        url: `/habits/${habitId}/logs`,
        method: "POST",
        body: {
          date,
          timezone: getUserTimezone(),
        },
      }),
      async onQueryStarted({ habitId, date }, { dispatch, queryFulfilled }) {
        const optimisticListPatch = dispatch(
          habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
            const habit = findHabitDraft(draft, habitId);
            addLogToHabitDraft(habit, habitId, date);
          })
        );

        const optimisticDetailPatch = dispatch(
          habitsApi.util.updateQueryData("getHabitById", habitId, (draft) => {
            addLogToHabitDraft(draft, habitId, date);
          })
        );

        try {
          const { data: updatedHabit } = await queryFulfilled;
          replaceHabitCaches(dispatch, updatedHabit);
        } catch {
          optimisticListPatch.undo();
          optimisticDetailPatch.undo();
        }
      },
    }),

    deleteHabitLog: builder.mutation<Habit, DeleteHabitLogRequest>({
      query: ({ habitId, date }) => ({
        url: `/habits/${habitId}/logs/${date}`,
        method: "DELETE",
        params: {
          timezone: getUserTimezone(),
        },
      }),
      async onQueryStarted({ habitId, date }, { dispatch, queryFulfilled }) {
        const optimisticListPatch = dispatch(
          habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
            const habit = findHabitDraft(draft, habitId);
            removeLogFromHabitDraft(habit, date);
          })
        );

        const optimisticDetailPatch = dispatch(
          habitsApi.util.updateQueryData("getHabitById", habitId, (draft) => {
            removeLogFromHabitDraft(draft, date);
          })
        );

        try {
          const { data: updatedHabit } = await queryFulfilled;
          replaceHabitCaches(dispatch, updatedHabit);
        } catch {
          optimisticListPatch.undo();
          optimisticDetailPatch.undo();
        }
      },
    }),
  }),
});

export const {
  useGetHabitsQuery,
  useGetHabitByIdQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useAddHabitLogMutation,
  useDeleteHabitLogMutation,
} = habitsApi;

function findHabitDraft(habits: Habit[], habitId: number) {
  return habits.find((habit) => habit.id === habitId);
}

function addLogToHabitDraft(
  habit: Habit | undefined,
  habitId: number,
  date: string
) {
  if (!habit || habit.logs.some((log) => log.date === date)) {
    return;
  }

  habit.logs.push({
    id: -Date.now(),
    habitId,
    date,
  });
}

function removeLogFromHabitDraft(habit: Habit | undefined, date: string) {
  if (!habit) {
    return;
  }

  habit.logs = habit.logs.filter((log) => log.date !== date);
}

function replaceHabitCaches(dispatch: AppDispatch, updatedHabit: Habit) {
  dispatch(
    habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
      const index = draft.findIndex((habit) => habit.id === updatedHabit.id);

      if (index !== -1) {
        draft[index] = updatedHabit;
      }
    })
  );

  dispatch(
    habitsApi.util.updateQueryData(
      "getHabitById",
      updatedHabit.id,
      (draft) => {
        Object.assign(draft, updatedHabit);
      }
    )
  );
}
