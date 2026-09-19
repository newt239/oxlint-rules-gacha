import type { Metadata } from "next";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { linkStyles } from "#/components/link-styles";
import { SiteHeader } from "#/components/site-header";
import { GachaMachine } from "#/features/gacha/gacha-machine";
import { color, text } from "#/styles/tokens.stylex";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const styles = stylex.create({
  footer: {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    paddingBlockEnd: "4rem",
  },
  link: {
    color: color.inkDim,
    fontSize: text.md,
  },
});

const Home = () => (
  <>
    <SiteHeader />
    <GachaMachine />
    <footer {...stylex.props(styles.footer)}>
      <Link href="/collection" {...stylex.props(linkStyles.underline, styles.link)}>
        Collection
      </Link>
      <Link href="/about" {...stylex.props(linkStyles.underline, styles.link)}>
        About
      </Link>
      <Link href="/privacy" {...stylex.props(linkStyles.underline, styles.link)}>
        Privacy
      </Link>
    </footer>
  </>
);

export default Home;
