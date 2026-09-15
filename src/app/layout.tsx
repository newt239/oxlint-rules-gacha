import type { Metadata } from "next";

import { GoogleAnalytics } from "@next/third-parties/google";
import * as stylex from "@stylexjs/stylex";
import { Baloo_2, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { GA_LOCAL_DISABLE_SCRIPT, GA_MEASUREMENT_ID } from "#/lib/analytics";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "#/lib/site";
import { color, font, text } from "#/styles/tokens.stylex";
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
  openGraph: {
    locale: "en_US",
    siteName: SITE_NAME,
    type: "website",
  },
  robots: { follow: true, index: true },
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
};

const styles = stylex.create({
  body: {
    backgroundColor: color.cabinet,
    color: color.ink,
    fontFamily: font.display,
    fontSize: text.md,
    lineHeight: 1.7,
  },
});

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => (
  <html lang="en" className={`${baloo2.variable} ${geistMono.variable}`}>
    <head>
      {GA_MEASUREMENT_ID !== "" && (
        <Script id="ga-disable-local" strategy="beforeInteractive">
          {GA_LOCAL_DISABLE_SCRIPT}
        </Script>
      )}
    </head>
    <body {...stylex.props(styles.body)}>
      {children}
      {GA_MEASUREMENT_ID !== "" && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </body>
  </html>
);

export default RootLayout;
