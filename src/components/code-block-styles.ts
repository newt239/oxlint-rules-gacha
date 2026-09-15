import * as stylex from "@stylexjs/stylex";

import { color, font, layout } from "#/styles/tokens.stylex";

export const codeBlockStyles = stylex.create({
  code: {
    fontFamily: font.mono,
    fontSize: "0.75rem",
    lineHeight: 1.7,
  },
  pre: {
    backgroundColor: color.cabinet2,
    borderRadius: layout.radius,
    color: color.ink,
    margin: 0,
    overflowX: "auto",
    padding: "1rem",
  },
});
