import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { SiteHeader } from "#/components/site-header";
import { RuleArticle } from "#/features/rule/rule-article";
import { findRuleDetail, ruleParams } from "#/lib/rule-catalog";
import { ruleHref } from "#/lib/rules";
import { SITE_NAME, SITE_URL } from "#/lib/site";

export const dynamicParams = false;

export const generateStaticParams = ruleParams;

type RulePageProps = {
  params: Promise<{ plugin: string; rule: string }>;
};

export const generateMetadata = async ({ params }: RulePageProps): Promise<Metadata> => {
  const { plugin, rule } = await params;
  const detail = findRuleDetail(plugin, rule);

  if (detail === undefined) {
    return {};
  }

  return {
    alternates: { canonical: `/rules/${plugin}/${rule}` },
    description: detail.summary,
    openGraph: {
      description: detail.summary,
      locale: "en_US",
      siteName: SITE_NAME,
      title: detail.id,
      type: "article",
    },
    robots: { follow: true, index: false },
    title: detail.id,
  };
};

const RulePage = async ({ params }: RulePageProps) => {
  const { plugin, rule } = await params;
  const detail = findRuleDetail(plugin, rule);

  if (detail === undefined) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <RuleArticle
        detail={detail}
        shareUrl={new URL(ruleHref(plugin, rule), SITE_URL).toString()}
      />
    </>
  );
};

export default RulePage;
