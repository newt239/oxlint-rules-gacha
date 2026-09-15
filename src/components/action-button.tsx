"use client";

import * as stylex from "@stylexjs/stylex";

import { actionStyles, type ActionVariant } from "./action-styles";

type ActionButtonProps = {
  busy?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant: ActionVariant;
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
