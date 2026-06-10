import { prisma } from "../config/prisma";

type HabitWithLogs = {
  logs: { date: Date }[];
};

function addHabitStats<T extends HabitWithLogs>(habit: T) {
  return {
    ...habit,
    currentStreak: 0,
    bestStreak: 0,
  };
}

export async function getHabits() {
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

  return habits.map(addHabitStats);
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

  return addHabitStats(habit);
}

export async function getHabitById(id: number) {
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

  return addHabitStats(habit);
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

  return addHabitStats(habit);
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