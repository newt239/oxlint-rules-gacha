import type { Metadata } from "next";

import * as stylex from "@stylexjs/stylex";
import { Baloo_2, Geist_Mono } from "next/font/google";

import { SiteFooter } from "#/components/site-footer";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "#/lib/site";
import { color, font } from "#/styles/tokens.stylex";
import "#/styles/globals.css";

const baloo2 = Baloo_2({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-baloo-2",
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["500"],
});

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  metadataBase: SITE_URL,
  robots: { follow: true, index: true },
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
};

const styles = stylex.create({
  body: {
    backgroundColor: color.cabinet,
    color: color.ink,
    display: "flex",
    flexDirection: "column",
    fontFamily: font.display,
    fontSize: "1rem",
    lineHeight: 1.7,
  },
  content: {
    flexGrow: 1,
  },
});

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => (
  <html lang="en" className={`${baloo2.variable} ${geistMono.variable}`}>
    <body {...stylex.props(styles.body)}>
      <div {...stylex.props(styles.content)}>{children}</div>
      <SiteFooter />
    </body>
  </html>
);

export default RootLayout;
