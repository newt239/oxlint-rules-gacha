import type { Metadata } from "next";

import { LANGS } from "#/i18n";

export const languageAlternates = (lang: string, path: string): Metadata["alternates"] => ({
  canonical: `/${lang}${path}`,
  languages: Object.fromEntries(LANGS.map((value) => [value, `/${value}${path}`])),
});
