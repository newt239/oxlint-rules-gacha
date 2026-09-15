import type { Metadata } from "next";

import { SiteHeader } from "#/components/site-header";
import { GachaMachine } from "#/features/gacha/gacha-machine";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const Home = () => (
  <>
    <SiteHeader />
    <GachaMachine />
  </>
);

export default Home;
