import { configureStore } from "@reduxjs/toolkit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { apiSlice } from "../../api/apiSlice";
import type { Habit } from "../../../types/habit";
import { habitsApi } from "../habitsApi";

const category = {
  id: 1,
  name: "Health",
  icon: "health.svg",
};

const habit: Habit = {
  id: 1,
  title: "Morning walk",
  categoryId: category.id,
  category,
  logs: [
    {
      id: 10,
      habitId: 1,
      date: "2026-06-08",
    },
  ],
  currentStreak: 1,
  bestStreak: 3,
  createdAt: "2026-06-01T00:00:00.000Z",
};

function setupStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
}

function responseJson(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

async function seedHabitCaches(store: ReturnType<typeof setupStore>) {
  await store.dispatch(
    habitsApi.util.upsertQueryData("getHabits", undefined, [habit])
  );
  await store.dispatch(
    habitsApi.util.upsertQueryData("getHabitById", habit.id, habit)
  );
}

function selectHabitList(store: ReturnType<typeof setupStore>) {
  return habitsApi.endpoints.getHabits.select()(store.getState()).data;
}

function selectHabitDetail(store: ReturnType<typeof setupStore>) {
  return habitsApi.endpoints.getHabitById.select(habit.id)(store.getState())
    .data;
}

describe("habitsApi optimistic log updates", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("optimistically adds a log and then replaces caches with the response habit", async () => {
    const store = setupStore();
    await seedHabitCaches(store);

    const updatedHabit: Habit = {
      ...habit,
      logs: [
        ...habit.logs,
        {
          id: 20,
          habitId: habit.id,
          date: "2026-06-09",
        },
      ],
      currentStreak: 2,
      bestStreak: 3,
    };

    const fetchResult = deferred<Response>();
    vi.stubGlobal("fetch", vi.fn(() => fetchResult.promise));

    const mutation = store.dispatch(
      habitsApi.endpoints.addHabitLog.initiate({
        habitId: habit.id,
        date: "2026-06-09",
      })
    );

    await Promise.resolve();

    expect(selectHabitList(store)?.[0].logs).toEqual([
      habit.logs[0],
      expect.objectContaining({
        habitId: habit.id,
        date: "2026-06-09",
      }),
    ]);
    expect(selectHabitDetail(store)?.logs).toEqual([
      habit.logs[0],
      expect.objectContaining({
        habitId: habit.id,
        date: "2026-06-09",
      }),
    ]);

    fetchResult.resolve(responseJson(updatedHabit));
    await mutation.unwrap();

    expect(selectHabitList(store)?.[0]).toEqual(updatedHabit);
    expect(selectHabitDetail(store)).toEqual(updatedHabit);
  });

  it("rolls back an optimistic added log when the request fails", async () => {
    const store = setupStore();
    await seedHabitCaches(store);

    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error")))
    );

    const mutation = store.dispatch(
      habitsApi.endpoints.addHabitLog.initiate({
        habitId: habit.id,
        date: "2026-06-09",
      })
    );

    await Promise.resolve();

    expect(selectHabitList(store)?.[0].logs).toHaveLength(2);

    await expect(mutation.unwrap()).rejects.toBeDefined();

    expect(selectHabitList(store)?.[0]).toEqual(habit);
    expect(selectHabitDetail(store)).toEqual(habit);
  });

  it("optimistically deletes a log and then replaces caches with the response habit", async () => {
    const store = setupStore();
    await seedHabitCaches(store);

    const updatedHabit: Habit = {
      ...habit,
      logs: [],
      currentStreak: 0,
      bestStreak: 3,
    };

    const fetchResult = deferred<Response>();
    vi.stubGlobal("fetch", vi.fn(() => fetchResult.promise));

    const mutation = store.dispatch(
      habitsApi.endpoints.deleteHabitLog.initiate({
        habitId: habit.id,
        date: "2026-06-08",
      })
    );

    await Promise.resolve();

    expect(selectHabitList(store)?.[0].logs).toEqual([]);
    expect(selectHabitDetail(store)?.logs).toEqual([]);

    fetchResult.resolve(responseJson(updatedHabit));
    await mutation.unwrap();

    expect(selectHabitList(store)?.[0]).toEqual(updatedHabit);
    expect(selectHabitDetail(store)).toEqual(updatedHabit);
  });

  it("rolls back an optimistic deleted log when the request fails", async () => {
    const store = setupStore();
    await seedHabitCaches(store);

    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error")))
    );

    const mutation = store.dispatch(
      habitsApi.endpoints.deleteHabitLog.initiate({
        habitId: habit.id,
        date: "2026-06-08",
      })
    );

    await Promise.resolve();

    expect(selectHabitList(store)?.[0].logs).toEqual([]);

    await expect(mutation.unwrap()).rejects.toBeDefined();

    expect(selectHabitList(store)?.[0]).toEqual(habit);
    expect(selectHabitDetail(store)).toEqual(habit);
  });
});
