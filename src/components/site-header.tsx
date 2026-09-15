import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { SITE_NAME } from "#/lib/site";
import { color, layout, text } from "#/styles/tokens.stylex";

const styles = stylex.create({
  brand: {
    color: color.ink,
    fontSize: text.lg,
    fontWeight: 700,
    textDecoration: "none",
  },
  header: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "1.25rem 0",
    paddingInline: layout.gutter,
  },
});

export const SiteHeader = () => (
  <header {...stylex.props(styles.header)}>
    <Link href="/" {...stylex.props(styles.brand)}>
      {SITE_NAME}
    </Link>
  </header>
);
