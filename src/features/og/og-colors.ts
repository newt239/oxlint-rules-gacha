import type { Category } from "#/lib/rules";

export const CABINET = "#14131F";

export const INK = "#FFF6E8";

export const INK_DIM = "#A8A2C4";

export const ON_TINT = "rgba(20, 19, 31, 0.7)";

export const CATEGORY_COLORS: Record<Category, string> = {
  correctness: "#FF4D5E",
  nursery: "#7A8CA8",
  pedantic: "#9B6DFF",
  perf: "#4ADE80",
  restriction: "#F5C14E",
  style: "#35D0D6",
  suspicious: "#FFC53D",
};

export const CATEGORY_SPECTRUM: Category[] = [
  "correctness",
  "suspicious",
  "restriction",
  "perf",
  "style",
  "pedantic",
  "nursery",
];
