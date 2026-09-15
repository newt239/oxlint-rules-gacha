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
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem 1rem",
    justifyContent: "space-between",
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "1.25rem 0",
    paddingInline: layout.gutter,
  },
  link: {
    color: color.inkDim,
    fontSize: text.md,
  },
  right: {
    alignItems: "center",
    display: "flex",
    gap: "1rem",
  },
});

export const SiteHeader = () => (
  <header {...stylex.props(styles.header)}>
    <Link href="/" {...stylex.props(styles.brand)}>
      {SITE_NAME}
    </Link>
    <div {...stylex.props(styles.right)}>
      <Link href="/collection" {...stylex.props(styles.link)}>
        Collection
      </Link>
      <Link href="/about" {...stylex.props(styles.link)}>
        About
      </Link>
    </div>
  </header>
);
