import * as stylex from "@stylexjs/stylex";

export const linkStyles = stylex.create({
  underline: {
    textDecorationColor: "color-mix(in srgb, currentcolor, transparent 40%)",
    textDecorationLine: "underline",
    textUnderlineOffset: "0.25em",
  },
});
