import * as stylex from "@stylexjs/stylex";

import { color, layout, text } from "#/styles/tokens.stylex";

export const pageStyles = stylex.create({
  article: {
    paddingBlock: "2.5rem 4rem",
  },
  backLink: {
    color: color.inkDim,
    display: "block",
    fontSize: text.md,
    marginBlockStart: "3rem",
    marginInline: "auto",
    width: "fit-content",
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingInline: layout.gutter,
  },
});
