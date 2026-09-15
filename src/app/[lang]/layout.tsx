import type { Metadata } from "next";

import * as stylex from "@stylexjs/stylex";
import { Baloo_2, Geist_Mono, Zen_Maru_Gothic } from "next/font/google";

import { LANGS } from "#/i18n";
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

const zenMaruGothic = Zen_Maru_Gothic({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-zen-maru-gothic",
  weight: ["400", "700"],
});

export const dynamicParams = false;

export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

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
    fontFamily: font.display,
    fontSize: "1rem",
    lineHeight: 1.7,
  },
  bodyJa: {
    fontFamily: font.displayJa,
  },
});

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

const RootLayout = async ({ children, params }: Readonly<RootLayoutProps>) => {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      className={`${baloo2.variable} ${geistMono.variable} ${zenMaruGothic.variable}`}
    >
      <body {...stylex.props(styles.body, lang === "ja" && styles.bodyJa)}>{children}</body>
    </html>
  );
};

export default RootLayout;
