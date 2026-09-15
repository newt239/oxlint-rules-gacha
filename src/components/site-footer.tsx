import * as stylex from "@stylexjs/stylex";

import { OXC_LICENSE_URL } from "#/lib/site";
import { color, layout } from "#/styles/tokens.stylex";

const styles = stylex.create({
  footer: {
    color: color.inkDim,
    fontSize: "0.8125rem",
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "2rem 1.5rem",
    paddingInline: layout.gutter,
    width: "100%",
  },
  link: {
    color: color.catStyle,
  },
});

export const SiteFooter = () => (
  <footer {...stylex.props(styles.footer)}>
    <a href={OXC_LICENSE_URL} rel="noreferrer" target="_blank" {...stylex.props(styles.link)}>
      Source: the oxc project (MIT)
    </a>
  </footer>
);
