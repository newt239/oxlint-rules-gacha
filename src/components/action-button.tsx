"use client";

import * as stylex from "@stylexjs/stylex";

import { actionStyles } from "./action-styles";

type ActionButtonProps = {
  busy?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant: "primary" | "secondary";
};

export const ActionButton = ({
  busy = false,
  children,
  disabled = false,
  onClick,
  variant,
}: ActionButtonProps) => (
  <button
    aria-busy={busy}
    disabled={busy || disabled}
    onClick={onClick}
    type="button"
    {...stylex.props(actionStyles.base, actionStyles[variant])}
  >
    {children}
  </button>
);
