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
      invalidatesTags: ["Habits"],
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
      invalidatesTags: ["Habits"],
    }),

    deleteHabitLog: builder.mutation<Habit, DeleteHabitLogRequest>({
      query: ({ habitId, date }) => ({
        url: `/habits/${habitId}/logs/${date}`,
        method: "DELETE",
        params: {
          timezone: getUserTimezone(),
        },
      }),
      invalidatesTags: ["Habits"],
    }),
  }),
});

export const {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useAddHabitLogMutation,
  useDeleteHabitLogMutation,
} = habitsApi;