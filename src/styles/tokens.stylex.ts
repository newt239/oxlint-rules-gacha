import * as stylex from "@stylexjs/stylex";

export const color = stylex.defineVars({
  cabinet: "#14131F",
  cabinet2: "#201E33",
  catCorrectness: "#FF4D5E",
  catNursery: "#7A8CA8",
  catPedantic: "#9B6DFF",
  catRestriction: "#F5C14E",
  catStyle: "#35D0D6",
  catSuspicious: "#FFC53D",
  ink: "#FFF6E8",
  inkDim: "#A8A2C4",
});

export const font = stylex.defineVars({
  display: "var(--font-baloo-2), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
});

export const layout = stylex.defineVars({
  gutter: "16px",
  maxWidth: "640px",
});
