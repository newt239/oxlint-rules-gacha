import * as stylex from "@stylexjs/stylex";

import { color, font, layout, text } from "#/styles/tokens.stylex";

export type ActionVariant = "primary" | "secondary" | "secondaryLarge" | "tonalLarge";

export const actionStyles = stylex.create({
  base: {
    backgroundColor: {
      ":disabled": color.cabinet2,
      ":hover": color.ink,
      default: color.ink,
    },
    borderColor: "transparent",
    borderRadius: layout.radius,
    borderStyle: "solid",
    borderWidth: "1px",
    color: {
      ":disabled": color.inkDim,
      default: color.cabinet,
    },
    cursor: { ":disabled": "progress", default: "pointer" },
    fontFamily: font.display,
    fontSize: text.md,
    fontWeight: 700,
    padding: "0.75rem 1.5rem",
  },
  link: {
    display: "inline-block",
    textAlign: "center",
    textDecoration: "none",
  },
  primary: {
    fontSize: text.lg,
    padding: "1rem 2.5rem",
  },
  secondary: {
    backgroundColor: { ":disabled": color.cabinet2, default: "transparent" },
    borderColor: color.inkDim,
    color: { ":disabled": color.inkDim, default: color.ink },
  },
  secondaryLarge: {
    backgroundColor: { ":disabled": color.cabinet2, default: "transparent" },
    borderColor: color.inkDim,
    color: { ":disabled": color.inkDim, default: color.ink },
    fontSize: text.lg,
    padding: "1rem 2.5rem",
  },
  tonalLarge: {
    backgroundColor: { ":disabled": color.cabinet2, default: color.cabinet2 },
    borderColor: color.ink,
    color: { ":disabled": color.inkDim, default: color.ink },
    fontSize: text.lg,
    padding: "1rem 2.5rem",
  },
});
