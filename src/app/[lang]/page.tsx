import type { Metadata } from "next";

import { SiteHeader } from "#/components/site-header";
import { GachaMachine } from "#/features/gacha/gacha-machine";
import { getDictionary } from "#/i18n";
import { languageAlternates } from "#/lib/alternates";

type HomeProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({ params }: HomeProps): Promise<Metadata> => {
  const { lang } = await params;

  return { alternates: languageAlternates(lang, "") };
};

const Home = async ({ params }: HomeProps) => {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return (
    <>
      <SiteHeader dictionary={dictionary} lang={lang} path="" />
      <GachaMachine dictionary={dictionary} lang={lang} />
    </>
  );
};

export default Home;
