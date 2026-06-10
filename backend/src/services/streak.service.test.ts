import { describe, expect, it } from "vitest";
import { calculateStreaks } from "./streak.service";

function date(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

describe("calculateStreaks", () => {
  it("returns zero streaks when there are no logs", () => {
    const result = calculateStreaks([], "2026-06-10");

    expect(result).toEqual({
      currentStreak: 0,
      bestStreak: 0,
    });
  });

  it("calculates current streak ending today", () => {
    const result = calculateStreaks(
      [
        date("2026-06-08"),
        date("2026-06-09"),
        date("2026-06-10"),
      ],
      "2026-06-10"
    );

    expect(result).toEqual({
      currentStreak: 3,
      bestStreak: 3,
    });
  });

  it("allows current streak to end yesterday", () => {
    const result = calculateStreaks(
      [
        date("2026-06-07"),
        date("2026-06-08"),
        date("2026-06-09"),
      ],
      "2026-06-10"
    );

    expect(result).toEqual({
      currentStreak: 3,
      bestStreak: 3,
    });
  });

  it("returns zero current streak when latest log is older than yesterday", () => {
    const result = calculateStreaks(
      [
        date("2026-06-01"),
        date("2026-06-02"),
        date("2026-06-03"),
      ],
      "2026-06-10"
    );

    expect(result).toEqual({
      currentStreak: 0,
      bestStreak: 3,
    });
  });

  it("calculates best streak across history", () => {
    const result = calculateStreaks(
      [
        date("2026-06-01"),
        date("2026-06-02"),
        date("2026-06-03"),
        date("2026-06-08"),
        date("2026-06-09"),
      ],
      "2026-06-10"
    );

    expect(result).toEqual({
      currentStreak: 2,
      bestStreak: 3,
    });
  });

  it("ignores duplicate dates", () => {
    const result = calculateStreaks(
      [
        date("2026-06-09"),
        date("2026-06-09"),
        date("2026-06-10"),
      ],
      "2026-06-10"
    );

    expect(result).toEqual({
      currentStreak: 2,
      bestStreak: 2,
    });
  });
});