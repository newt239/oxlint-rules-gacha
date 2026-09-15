"use client";

import * as stylex from "@stylexjs/stylex";

import { color, font, layout } from "#/styles/tokens.stylex";

const styles = stylex.create({
  button: {
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

type ActionButtonProps = {
  busy?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary";
};

export const ActionButton = ({ busy = false, children, onClick, variant }: ActionButtonProps) => (
  <button
    aria-busy={busy}
    disabled={busy}
    onClick={onClick}
    type="button"
    {...stylex.props(styles.button, styles[variant])}
  >
    {children}
  </button>
);
