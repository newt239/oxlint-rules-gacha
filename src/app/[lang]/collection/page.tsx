import type { Metadata } from "next";

import { CollectionView } from "#/features/collection/collection-view";
import { getDictionary } from "#/i18n";

type CollectionPageProps = {
  params: Promise<{ lang: string }>;
};

export const generateMetadata = async ({ params }: CollectionPageProps): Promise<Metadata> => {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return { description: dictionary.collectionDescription, title: dictionary.collection };
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const { lang } = await params;

  return <CollectionView dictionary={getDictionary(lang)} lang={lang} />;
};

export default CollectionPage;
