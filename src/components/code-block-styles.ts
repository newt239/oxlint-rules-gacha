import * as stylex from "@stylexjs/stylex";

import { color, font, layout, text } from "#/styles/tokens.stylex";

export const codeBlockStyles = stylex.create({
  code: {
    fontFamily: font.mono,
    fontSize: text.md,
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
