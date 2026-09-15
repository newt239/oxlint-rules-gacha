import { SITE_NAME } from "#/lib/site";

import type { Category } from "#/lib/rules";

import type { ImageResponse } from "next/og";

const { readFile } = process.getBuiltinModule("node:fs/promises");

const assetsDir = `${process.cwd()}/assets`;

const [regular, bold] = await Promise.all([
  readFile(`${assetsDir}/Baloo2-Regular.ttf`),
  readFile(`${assetsDir}/Baloo2-Bold.ttf`),
]);

export const OG_ALT = SITE_NAME;

export const OG_CONTENT_TYPE = "image/png";

export const OG_SIZE = { height: 630, width: 1200 };

type OgImageOptions = ConstructorParameters<typeof ImageResponse>[1];

export const OG_IMAGE_OPTIONS: OgImageOptions = {
  ...OG_SIZE,
  fonts: [
    { data: regular, name: "Baloo 2", style: "normal", weight: 400 },
    { data: bold, name: "Baloo 2", style: "normal", weight: 700 },
  ],
};

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
