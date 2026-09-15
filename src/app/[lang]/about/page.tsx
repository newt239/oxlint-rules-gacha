import type { Metadata } from "next";

import { SiteHeader } from "#/components/site-header";
import { AboutArticle } from "#/features/about/about-article";
import { getDictionary } from "#/i18n";
import { languageAlternates } from "#/lib/alternates";

type AboutPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({ params }: AboutPageProps): Promise<Metadata> => {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return {
    alternates: languageAlternates(lang, "/about"),
    description: dictionary.aboutIntro,
    title: dictionary.about,
  };
};

const AboutPage = async ({ params }: AboutPageProps) => {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return (
    <>
      <SiteHeader dictionary={dictionary} lang={lang} path="/about" />
      <AboutArticle dictionary={dictionary} lang={lang} />
    </>
  );
};

export default AboutPage;
