import type { Route } from "next";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { actionStyles } from "#/components/action-styles";

type ActionLinkProps = {
  children: React.ReactNode;
  href: Route;
  onClick?: () => void;
};

export const ActionLink = ({ children, href, onClick }: ActionLinkProps) => (
  <Link href={href} onClick={onClick} {...stylex.props(actionStyles.base, actionStyles.link)}>
    {children}
  </Link>
);
