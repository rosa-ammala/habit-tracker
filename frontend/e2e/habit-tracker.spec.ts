import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const testDates = getCurrentWeekTestDates();

const categories = [
  {
    id: 1,
    name: "Health",
    icon: "health.svg",
  },
  {
    id: 2,
    name: "Learning",
    icon: "book.svg",
  },
];

const baseHabit = {
  id: 1,
  title: "Morning walk",
  categoryId: 1,
  category: categories[0],
  logs: testDates.initialLogDate
    ? [
        {
          id: 10,
          habitId: 1,
          date: testDates.initialLogDate,
        },
      ]
    : [],
  currentStreak: testDates.completedWeekDays,
  bestStreak: 3,
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

async function mockHabitApi(page: Page) {
  let habit = structuredClone(baseHabit);

  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (!path.startsWith("/api/")) {
      await route.continue();
      return;
    }

    if (request.method() === "GET" && path === "/api/categories") {
      await route.fulfill({ json: categories });
      return;
    }

    if (request.method() === "GET" && path === "/api/habits") {
      await route.fulfill({ json: [habit] });
      return;
    }

    if (request.method() === "GET" && path === "/api/habits/1") {
      await route.fulfill({ json: habit });
      return;
    }

    if (request.method() === "POST" && path === "/api/habits/1/logs") {
      const body = request.postDataJSON() as { date: string };
      habit = {
        ...habit,
        logs: [
          ...habit.logs,
          {
            id: 20,
            habitId: habit.id,
            date: body.date,
          },
        ],
        currentStreak: 2,
      };

      await route.fulfill({ json: habit });
      return;
    }

    if (
      request.method() === "DELETE" &&
      path === `/api/habits/1/logs/${testDates.toggleDate}`
    ) {
      habit = {
        ...habit,
        logs: habit.logs.filter((log) => log.date !== testDates.toggleDate),
        currentStreak: Math.max(0, habit.currentStreak - 1),
      };

      await route.fulfill({ json: habit });
      return;
    }

    await route.fulfill({
      status: 404,
      json: { message: `Unhandled test route: ${request.method()} ${path}` },
    });
  });
}

test.beforeEach(async ({ page }) => {
  await mockHabitApi(page);
});

test("loads the habit dashboard", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Habit Tracker" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Add habit" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Health" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Morning walk" })).toBeVisible();
  await expect(
    page.getByText(
      `${testDates.completedWeekDays} of ${testDates.eligibleWeekDays} habit-days completed`
    )
  ).toBeVisible();
});

test("opens the habit detail page", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Morning walk" }).click();

  await expect(page).toHaveURL("/habits/1");
  await expect(page.getByRole("heading", { name: "Morning walk" })).toBeVisible();
  await expect(page.getByText("Current streak")).toBeVisible();
  await expect(page.getByText("Best streak")).toBeVisible();
});

test("toggles a habit log from the dashboard", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: `Not completed, ${testDates.toggleDate}` })
    .click();

  await expect(
    page.getByRole("button", { name: `Completed, ${testDates.toggleDate}` })
  ).toBeVisible();
});

test("has no obvious accessibility violations on main pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Habit Tracker" })).toBeVisible();

  const homeResults = await new AxeBuilder({ page }).analyze();
  expect(homeResults.violations).toEqual([]);

  await page.getByRole("link", { name: "Morning walk" }).click();
  await expect(page.getByRole("heading", { name: "Morning walk" })).toBeVisible();

  const detailResults = await new AxeBuilder({ page }).analyze();
  expect(detailResults.violations).toEqual([]);
});

function getCurrentWeekTestDates() {
  const today = new Date();
  const weekStartDate = getStartOfWeek(today);
  const todayDateOnly = toDateOnly(today);
  const weekStart = toDateOnly(weekStartDate);
  const initialLogDate = weekStart === todayDateOnly ? null : weekStart;
  const toggleDate = todayDateOnly;
  const eligibleWeekDays = Math.min(
    7,
    differenceInDays(weekStartDate, parseDateOnly(todayDateOnly)) + 1
  );
  const completedWeekDays = initialLogDate ? 1 : 0;

  return {
    weekStart,
    initialLogDate,
    toggleDate,
    eligibleWeekDays,
    completedWeekDays,
  };
}

function getStartOfWeek(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diff);

  return start;
}

function addDays(date: Date, amount: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);

  return nextDate;
}

function parseDateOnly(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function differenceInDays(start: Date, end: Date) {
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.round((endUtc - startUtc) / millisecondsInDay);
}
