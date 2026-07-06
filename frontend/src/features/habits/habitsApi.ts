import { apiSlice } from "../api/apiSlice";
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
      providesTags: ["Habits"],
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
      invalidatesTags: ["Habits"],
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
            const habit = draft.find((habit) => habit.id === habitId);

            if (!habit || habit.logs.some((log) => log.date === date)) {
              return;
            }

            habit.logs.push({
              id: -Date.now(),
              habitId,
              date,
            });
          })
        );

        const optimisticDetailPatch = dispatch(
          habitsApi.util.updateQueryData("getHabitById", habitId, (draft) => {
            if (draft.logs.some((log) => log.date === date)) {
              return;
            }

            draft.logs.push({
              id: -Date.now(),
              habitId,
              date,
            });
          })
        );

        try {
          const { data: updatedHabit } = await queryFulfilled;

          dispatch(
            habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
              const index = draft.findIndex(
                (habit) => habit.id === updatedHabit.id
              );

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
            const habit = draft.find((habit) => habit.id === habitId);

            if (!habit) {
              return;
            }

            habit.logs = habit.logs.filter((log) => log.date !== date);
          })
        );

        const optimisticDetailPatch = dispatch(
          habitsApi.util.updateQueryData("getHabitById", habitId, (draft) => {
            draft.logs = draft.logs.filter((log) => log.date !== date);
          })
        );

        try {
          const { data: updatedHabit } = await queryFulfilled;

          dispatch(
            habitsApi.util.updateQueryData("getHabits", undefined, (draft) => {
              const index = draft.findIndex(
                (habit) => habit.id === updatedHabit.id
              );

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
