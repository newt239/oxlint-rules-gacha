import type { Metadata } from "next";

import * as stylex from "@stylexjs/stylex";

import { color, font } from "#/styles/tokens.stylex";
import "#/styles/globals.css";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

const styles = stylex.create({
  body: {
    backgroundColor: color.cabinet,
    color: color.ink,
    fontFamily: font.display,
    fontSize: "1rem",
  },
});

type LanguageGateLayoutProps = {
  children: React.ReactNode;
};

const LanguageGateLayout = ({ children }: Readonly<LanguageGateLayoutProps>) => (
  <html lang="en">
    <body {...stylex.props(styles.body)}>{children}</body>
  </html>
);

export default LanguageGateLayout;
