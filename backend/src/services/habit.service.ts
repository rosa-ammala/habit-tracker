import { prisma } from "../config/prisma";
import {
  isFutureDateInTimezone,
  isValidDateOnlyString,
  parseDateOnlyAsUtcDate,
} from "../utils/date";
import { calculateStreaks } from "./streak.service";
import { getTodayInTimezone } from "../utils/date";

type HabitWithLogs = {
  logs: { date: Date }[];
};

function toDateOnlyString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toHabitResponse<T extends HabitWithLogs>(
  habit: T,
  timezone = "UTC"
) {
  const today = getTodayInTimezone(timezone);

  const streaks = calculateStreaks(
    habit.logs.map((log) => log.date),
    today
  );

  return {
    ...habit,
    logs: habit.logs.map((log) => ({
      ...log,
      date: toDateOnlyString(log.date),
    })),
    ...streaks,
  };
}

export async function getHabits(timezone = "UTC") {
  const habits = await prisma.habit.findMany({
    include: {
      category: true,
      logs: {
        orderBy: {
          date: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return habits.map((habit) => toHabitResponse(habit, timezone));
}

export async function createHabit(data: {
  title: string;
  categoryId: number;
}) {
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  const habit = await prisma.habit.create({
    data: {
      title: data.title,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
      logs: true,
    },
  });

  return toHabitResponse(habit);
}

export async function getHabitById(id: number, timezone = "UTC") {
  return getHabitResponseById(id, timezone);
}

export async function updateHabit(
  id: number,
  data: {
    title: string;
    categoryId: number;
  }
) {
  const existingHabit = await prisma.habit.findUnique({
    where: {
      id,
    },
  });

  if (!existingHabit) {
    throw new Error("HABIT_NOT_FOUND");
  }

  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  const habit = await prisma.habit.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      categoryId: data.categoryId,
    },
    include: {
      category: true,
      logs: {
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  return toHabitResponse(habit);
}

export async function deleteHabit(id: number) {
  const existingHabit = await prisma.habit.findUnique({
    where: {
      id,
    },
  });

  if (!existingHabit) {
    throw new Error("HABIT_NOT_FOUND");
  }

  await prisma.habit.delete({
    where: {
      id,
    },
  });
}

// LOGS
export async function addHabitLog(
  habitId: number,
  data: {
    date: string;
    timezone: string;
  }
) {
  if (!isValidDateOnlyString(data.date)) {
    throw new Error("INVALID_DATE");
  }

  if (isFutureDateInTimezone(data.date, data.timezone)) {
    throw new Error("FUTURE_DATE_NOT_ALLOWED");
  }

  const habit = await prisma.habit.findUnique({
    where: {
      id: habitId,
    },
  });

  if (!habit) {
    throw new Error("HABIT_NOT_FOUND");
  }

  await prisma.habitLog.create({
    data: {
      habitId,
      date: parseDateOnlyAsUtcDate(data.date),
    },
  });

  return getHabitResponseById(habitId, data.timezone);
}

export async function deleteHabitLog(
  habitId: number,
  date: string,
  timezone = "UTC"
) {
  if (!isValidDateOnlyString(date)) {
    throw new Error("INVALID_DATE");
  }

  const habit = await prisma.habit.findUnique({
    where: {
      id: habitId,
    },
  });

  if (!habit) {
    throw new Error("HABIT_NOT_FOUND");
  }

  await prisma.habitLog.delete({
    where: {
      habitId_date: {
        habitId,
        date: parseDateOnlyAsUtcDate(date),
      },
    },
  });

  return getHabitResponseById(habitId, timezone);
}

// HELPERS
async function getHabitResponseById(id: number, timezone = "UTC") {
  const habit = await prisma.habit.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      logs: {
        orderBy: {
          date: "asc",
        },
      },
    },
  });

  if (!habit) {
    throw new Error("HABIT_NOT_FOUND");
  }

  return toHabitResponse(habit, timezone);
}