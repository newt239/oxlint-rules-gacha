import type { Metadata } from "next";

import { SiteHeader } from "#/components/site-header";
import { PrivacyArticle } from "#/features/privacy/privacy-article";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  description: "How oxlint rules gacha handles analytics, cookies and browser storage.",
  title: "Privacy",
};

const PrivacyPage = () => (
  <>
    <SiteHeader />
    <PrivacyArticle />
  </>
);

export default PrivacyPage;
