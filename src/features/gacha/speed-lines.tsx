"use client";

import * as stylex from "@stylexjs/stylex";

import { color } from "#/styles/tokens.stylex";

const MASK = "radial-gradient(circle, transparent 26%, black 62%)";

const spin = stylex.keyframes({
  from: { rotate: "0deg" },
  to: { rotate: "360deg" },
});

const styles = stylex.create({
  lines: {
    WebkitMaskImage: MASK,
    animationDuration: "9s",
    animationIterationCount: "infinite",
    animationName: spin,
    animationTimingFunction: "linear",
    backgroundImage: `repeating-conic-gradient(from 0deg, ${color.ink} 0deg 0.7deg, transparent 0.7deg 5deg)`,
    inset: "-40%",
    maskImage: MASK,
    position: "absolute",
  },
  wrap: {
    inset: 0,
    opacity: 0,
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
  },
});

export const SpeedLines = () => (
  <div aria-hidden data-speed-lines {...stylex.props(styles.wrap)}>
    <div {...stylex.props(styles.lines)} />
  </div>
);
