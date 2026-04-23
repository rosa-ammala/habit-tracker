import { prisma } from "../config/prisma";
import { calculateStreaks } from "../utils/streaks";

export const getHabits = async (req: any, res: any) => {
  try {
    const habits = await prisma.habit.findMany({
      include: { 
        category: true, 
        logs: true 
      },
      orderBy: { 
        createdAt: "desc" 
      },
    });

    const result = habits.map((habit) => {
      const dates = habit.logs.map((log) => log.date);
      const { currentStreak, bestStreak } = calculateStreaks(dates);

      return { ...habit, currentStreak, bestStreak };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching habits" });
  }
};

export const createHabit = async (req: any, res: any) => {
  try {
    const { title, categoryId } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({ 
        message: 'Title and category are required' 
      });
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        categoryId,
      },
      include: {
        category: true,
        logs: true,
      },
    });

    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating habit' });
  }
}

export const updateHabit = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const { title, categoryId } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({
        message: "Title and category are required",
      });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: {
        title,
        categoryId: Number(categoryId),
      },
      include: {
        category: true,
        logs: true,
      },
    });

    res.json(updatedHabit);
  } catch (error) {
    console.error(error);

    if ((error as any).code === "P2025") {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(500).json({ message: "Error updating habit" });
  }
}

export const deleteHabit = async (req: any, res: any) => {
  try {
    const habitId = Number(req.params.id);

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting habit' });
  }
}

export const createHabitLog = async (req: any, res: any) => {
  try {
    const habitId = Number(req.params.id);
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Europe/Helsinki',
    });

    if (date > today) {
      return res.status(400).json({ message: 'Cannot log future dates' });
    }

    const existing = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Log already exists for this date' });
    }

    const log = await prisma.habitLog.create({
      data: {
        habitId,
        date,
      },
    });

    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging habit' });
  }
}

export const deleteHabitLog = async (req: any, res: any) => {
  try {
    const habitId = Number(req.params.id);
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const existing = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await prisma.habitLog.delete({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    res.json({ message: 'Log deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting log' });
  }
}