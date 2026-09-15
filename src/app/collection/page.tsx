import type { Metadata } from "next";

import { SiteHeader } from "#/components/site-header";
import { CollectionView } from "#/features/collection/collection-view";
import { COLLECTION_DESCRIPTION } from "#/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/collection" },
  description: COLLECTION_DESCRIPTION,
  title: "Collection",
};

const CollectionPage = () => (
  <>
    <SiteHeader />
    <CollectionView />
  </>
);

export default CollectionPage;
