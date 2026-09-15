import * as stylex from "@stylexjs/stylex";
import Link from "next/link";

import { type Lang, LANGS, type Dictionary } from "#/i18n";
import { SITE_NAME } from "#/lib/site";
import { color, layout } from "#/styles/tokens.stylex";

const LANG_LABELS: Record<Lang, string> = { en: "English", ja: "日本語" };

const styles = stylex.create({
  brand: {
    color: color.ink,
    fontSize: "0.9375rem",
    fontWeight: 700,
    textDecoration: "none",
  },
  current: {
    color: color.ink,
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem 1rem",
    justifyContent: "space-between",
    marginInline: "auto",
    maxWidth: layout.maxWidth,
    paddingBlock: "1.25rem 0",
    paddingInline: layout.gutter,
  },
  langs: {
    display: "flex",
    gap: "0.75rem",
  },
  link: {
    color: color.inkDim,
    fontSize: "0.8125rem",
  },
  right: {
    alignItems: "center",
    display: "flex",
    gap: "1rem",
  },
});

type SiteHeaderProps = {
  dictionary: Dictionary;
  lang: string;
  path: string;
};

export const SiteHeader = ({ dictionary, lang, path }: SiteHeaderProps) => (
  <header {...stylex.props(styles.header)}>
    <Link href={`/${lang}`} {...stylex.props(styles.brand)}>
      {SITE_NAME}
    </Link>
    <div {...stylex.props(styles.right)}>
      <Link href={`/${lang}/collection`} {...stylex.props(styles.link)}>
        {dictionary.collection}
      </Link>
      <nav aria-label={dictionary.languageLabel} {...stylex.props(styles.langs)}>
        {LANGS.map((value) => (
          <a
            key={value}
            aria-current={value === lang ? "true" : undefined}
            href={`/${value}${path}`}
            hrefLang={value}
            {...stylex.props(styles.link, value === lang && styles.current)}
          >
            {LANG_LABELS[value]}
          </a>
        ))}
      </nav>
    </div>
  </header>
);
