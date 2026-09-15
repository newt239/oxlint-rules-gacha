import type { Route } from "next";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { actionStyles, type ActionVariant } from "./action-styles";

type ActionLinkProps = {
  children: React.ReactNode;
  href: Route;
  onClick?: () => void;
  variant: ActionVariant;
};

export const ActionLink = ({ children, href, onClick, variant }: ActionLinkProps) => (
  <Link
    href={href}
    onClick={onClick}
    {...stylex.props(actionStyles.base, actionStyles[variant], actionStyles.link)}
  >
    {children}
  </Link>
);
