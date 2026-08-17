import * as v from "valibot";
import { isValidDateOnlyString } from "../utils/date";

const MAX_HABIT_TITLE_LENGTH = 80;

const habitTitleSchema = v.pipe(
  v.string("TITLE_REQUIRED"),
  v.trim(),
  v.minLength(1, "TITLE_REQUIRED"),
  v.maxLength(MAX_HABIT_TITLE_LENGTH, "TITLE_TOO_LONG")
);

const dateSchema = v.pipe(
  v.string("DATE_REQUIRED"),
  v.minLength(1, "DATE_REQUIRED"),
  v.check(isValidDateOnlyString, "INVALID_DATE")
);

const requiredTimezoneSchema = v.pipe(
  v.string("TIMEZONE_REQUIRED"),
  v.trim(),
  v.minLength(1, "TIMEZONE_REQUIRED"),
  v.check(isValidTimezone, "INVALID_TIMEZONE")
);

const optionalTimezoneSchema = v.pipe(
  v.optional(v.string("INVALID_TIMEZONE"), "UTC"),
  v.trim(),
  v.check(isValidTimezone, "INVALID_TIMEZONE")
);

const habitIdSchema = positiveIntegerSchema("INVALID_HABIT_ID");
const categoryIdSchema = positiveIntegerSchema("INVALID_CATEGORY_ID");

export const habitIdParamsSchema = v.object({
  id: habitIdSchema,
});

export const habitLogParamsSchema = v.object({
  id: habitIdSchema,
  date: dateSchema,
});

export const timezoneQuerySchema = v.object({
  timezone: optionalTimezoneSchema,
});

export const createHabitBodySchema = v.object({
  title: habitTitleSchema,
  categoryId: categoryIdSchema,
});

export const updateHabitBodySchema = createHabitBodySchema;

export const habitLogBodySchema = v.object({
  date: dateSchema,
  timezone: requiredTimezoneSchema,
});

function positiveIntegerSchema(errorCode: string) {
  return v.pipe(
    v.unknown(),
    v.transform((input) =>
      typeof input === "number" || typeof input === "string"
        ? Number(input)
        : Number.NaN
    ),
    v.number(errorCode),
    v.finite(errorCode),
    v.integer(errorCode),
    v.minValue(1, errorCode)
  );
}

function isValidTimezone(timezone: string) {
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}
