import { SITE_NAME } from "#/lib/site";

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
