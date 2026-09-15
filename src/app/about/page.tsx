import type { Metadata } from "next";

import { SiteHeader } from "#/components/site-header";
import { AboutArticle } from "#/features/about/about-article";
import { ABOUT_INTRO } from "#/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  description: ABOUT_INTRO,
  title: "About",
};

const AboutPage = () => (
  <>
    <SiteHeader />
    <AboutArticle />
  </>
);

export default AboutPage;
