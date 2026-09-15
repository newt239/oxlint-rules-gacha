import { GachaMachine } from "#/features/gacha/gacha-machine";
import { getDictionary } from "#/i18n";

type HomeProps = {
  params: Promise<{ lang: string }>;
};

const Home = async ({ params }: HomeProps) => {
  const { lang } = await params;

  return <GachaMachine dictionary={getDictionary(lang)} lang={lang} />;
};

export default Home;
