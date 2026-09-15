import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { SiteHeader } from "#/components/site-header";
import { RuleArticle } from "#/features/rule/rule-article";
import { findRuleDetail, RULE_IDS } from "#/lib/rule-catalog";
import { SITE_NAME } from "#/lib/site";

export const dynamicParams = false;

export const generateStaticParams = () =>
  RULE_IDS.map((id) => {
    const [plugin = "", rule = ""] = id.split("/");

    return { plugin, rule };
  });

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
      <RuleArticle detail={detail} />
    </>
  );
};

export default RulePage;
