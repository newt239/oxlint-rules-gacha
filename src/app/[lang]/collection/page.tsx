import type { Metadata } from "next";

import { SiteHeader } from "#/components/site-header";
import { CollectionView } from "#/features/collection/collection-view";
import { getDictionary } from "#/i18n";
import { languageAlternates } from "#/lib/alternates";

type CollectionPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({ params }: CollectionPageProps): Promise<Metadata> => {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return {
    alternates: languageAlternates(lang, "/collection"),
    description: dictionary.collectionDescription,
    title: dictionary.collection,
  };
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return (
    <>
      <SiteHeader dictionary={dictionary} lang={lang} path="/collection" />
      <CollectionView dictionary={dictionary} lang={lang} />
    </>
  );
};

export default CollectionPage;
