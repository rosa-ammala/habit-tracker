export const VIEWS = ["day", "week", "month"] as const;

export type View = (typeof VIEWS)[number];
