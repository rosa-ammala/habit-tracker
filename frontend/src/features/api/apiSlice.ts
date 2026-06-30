import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  }),
  tagTypes: ["Categories", "Habits", "Habit"],
  endpoints: () => ({}),
});