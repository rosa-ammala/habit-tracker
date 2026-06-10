import { describe, expect, it, vi } from "vitest";
import {
  getTodayInTimezone,
  isFutureDateInTimezone,
  isValidDateOnlyString,
  parseDateOnlyAsUtcDate,
} from "./date";

describe("date utils", () => {
  it("accepts valid date-only strings", () => {
    expect(isValidDateOnlyString("2026-06-10")).toBe(true);
  });

  it("rejects invalid date formats", () => {
    expect(isValidDateOnlyString("10-06-2026")).toBe(false);
    expect(isValidDateOnlyString("2026/06/10")).toBe(false);
    expect(isValidDateOnlyString("2026-6-10")).toBe(false);
  });

  it("rejects impossible calendar dates", () => {
    expect(isValidDateOnlyString("2026-02-30")).toBe(false);
    expect(isValidDateOnlyString("2026-02-29")).toBe(false);
    expect(isValidDateOnlyString("2024-02-29")).toBe(true);
    expect(isValidDateOnlyString("2026-13-01")).toBe(false);
    expect(isValidDateOnlyString("2026-00-10")).toBe(false);
  });

  it("parses date-only string as UTC midnight", () => {
    const result = parseDateOnlyAsUtcDate("2026-06-10");

    expect(result.toISOString()).toBe("2026-06-10T00:00:00.000Z");
  });

  it("gets today in the given timezone", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T21:30:00.000Z"));

    expect(getTodayInTimezone("Europe/Helsinki")).toBe("2026-06-11");
    expect(getTodayInTimezone("America/New_York")).toBe("2026-06-10");

    vi.useRealTimers();
  });

  it("detects future dates in the given timezone", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-10T21:30:00.000Z"));

    expect(isFutureDateInTimezone("2026-06-12", "Europe/Helsinki")).toBe(true);
    expect(isFutureDateInTimezone("2026-06-11", "Europe/Helsinki")).toBe(false);
    expect(isFutureDateInTimezone("2026-06-11", "America/New_York")).toBe(true);

    vi.useRealTimers();
  });
});