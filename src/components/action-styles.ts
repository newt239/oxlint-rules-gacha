import * as stylex from "@stylexjs/stylex";

import { color, font, layout } from "#/styles/tokens.stylex";

export const actionStyles = stylex.create({
  base: {
    backgroundColor: {
      ":disabled": color.cabinet2,
      ":hover": color.ink,
      default: color.ink,
    },
    borderRadius: layout.radius,
    borderStyle: "none",
    color: {
      ":disabled": color.inkDim,
      default: color.cabinet,
    },
    cursor: { ":disabled": "progress", default: "pointer" },
    fontFamily: font.display,
    fontSize: "1rem",
    fontWeight: 700,
    padding: "0.75rem 1.5rem",
  },
  link: {
    display: "inline-block",
    textAlign: "center",
    textDecoration: "none",
  },
  primary: {
    fontSize: "1.25rem",
    padding: "1rem 2.5rem",
  },
  secondary: {
    backgroundColor: { ":disabled": color.cabinet2, default: "transparent" },
    borderColor: color.inkDim,
    borderStyle: "solid",
    borderWidth: "1px",
    color: { ":disabled": color.inkDim, default: color.ink },
  },
});
