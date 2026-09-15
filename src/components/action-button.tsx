"use client";

import * as stylex from "@stylexjs/stylex";

import { actionStyles } from "./action-styles";

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
    {...stylex.props(actionStyles.base, actionStyles[variant])}
  >
    {children}
  </button>
);
