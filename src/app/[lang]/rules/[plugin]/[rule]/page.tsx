import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { SiteHeader } from "#/components/site-header";
import { RuleArticle } from "#/features/rule/rule-article";
import { getDictionary } from "#/i18n";
import { languageAlternates } from "#/lib/alternates";
import { findRuleDetail, RULE_IDS } from "#/lib/rule-catalog";
import { SITE_NAME } from "#/lib/site";

export const dynamicParams = false;

export const generateStaticParams = () =>
  RULE_IDS.map((id) => {
    const [plugin = "", rule = ""] = id.split("/");

    return { plugin, rule };
  });

type RulePageProps = {
  params: Promise<{ lang: string; plugin: string; rule: string }>;
};

export const generateMetadata = async ({ params }: RulePageProps): Promise<Metadata> => {
  const { lang, plugin, rule } = await params;
  const detail = findRuleDetail(plugin, rule);

  if (detail === undefined) {
    return {};
  }

  return {
    alternates: languageAlternates(lang, `/rules/${plugin}/${rule}`),
    description: detail.summary,
    openGraph: {
      description: detail.summary,
      siteName: SITE_NAME,
      title: detail.id,
      type: "article",
    },
    title: detail.id,
  };
};

const RulePage = async ({ params }: RulePageProps) => {
  const { lang, plugin, rule } = await params;
  const detail = findRuleDetail(plugin, rule);

  if (detail === undefined) {
    notFound();
  }

  const dictionary = getDictionary(lang);

  return (
    <>
      <SiteHeader dictionary={dictionary} lang={lang} path={`/rules/${plugin}/${rule}`} />
      <RuleArticle detail={detail} dictionary={dictionary} lang={lang} />
    </>
  );
};

export default RulePage;
