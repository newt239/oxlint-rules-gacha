"use client";

import { useEffect } from "react";

import * as stylex from "@stylexjs/stylex";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { langStore } from "#/lib/stores";
import { color, layout } from "#/styles/tokens.stylex";

const styles = stylex.create({
  link: {
    color: color.inkDim,
    fontSize: "0.875rem",
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "3rem",
    paddingInline: layout.gutter,
  },
});

const LanguageGatePage = () => {
  const router = useRouter();

  // LocalStorage は描画後にしか読めないため、記憶した言語への振り分けは効果で行う
  useEffect(() => {
    router.replace(langStore.getSnapshot() === "ja" ? "/ja" : "/en");
  }, [router]);

  return (
    <main {...stylex.props(styles.main)}>
      <Link href="/en" hrefLang="en" {...stylex.props(styles.link)}>
        English
      </Link>
      {" / "}
      <Link href="/ja" hrefLang="ja" {...stylex.props(styles.link)}>
        日本語
      </Link>
    </main>
  );
};

export default LanguageGatePage;
