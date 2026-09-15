import { en, type Dictionary } from "./en";
import { ja } from "./ja";

export const LANGS = ["en", "ja"] as const;

export type Lang = (typeof LANGS)[number];

export type { Dictionary };

const DICTIONARIES: Record<Lang, Dictionary> = { en, ja };

const isLang = (value: string): value is Lang => LANGS.some((lang) => lang === value);

export const getDictionary = (lang: string): Dictionary => (isLang(lang) ? DICTIONARIES[lang] : en);
