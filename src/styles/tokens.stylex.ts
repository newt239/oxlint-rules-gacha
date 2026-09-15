import * as stylex from "@stylexjs/stylex";

export const color = stylex.defineVars({
  cabinet: "#14131F",
  cabinet2: "#201E33",
  catCorrectness: "#FF4D5E",
  catNursery: "#7A8CA8",
  catPedantic: "#9B6DFF",
  catPerf: "#4ADE80",
  catRestriction: "#F5C14E",
  catStyle: "#35D0D6",
  catSuspicious: "#FFC53D",
  ink: "#FFF6E8",
  inkDim: "#A8A2C4",
  scrim: "#14131FCC",
});

export const font = stylex.defineVars({
  display: "var(--font-baloo-2), ui-sans-serif, system-ui, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace",
});

export const layout = stylex.defineVars({
  gutter: "16px",
  maxWidth: "640px",
  radius: "14px",
});

export const text = stylex.defineVars({
  display: "clamp(1.5rem, 6vw, 2rem)",
  lg: "1.25rem",
  md: "1rem",
  reveal: "clamp(1.25rem, 4.6vw, 1.5rem)",
  ruleId: "clamp(1.5rem, 7vw, 2.25rem)",
  sm: "0.75rem",
  xl: "1.5rem",
});
