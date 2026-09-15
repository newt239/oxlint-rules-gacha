import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const LANGS = ["javascript", "typescript", "jsx", "json", "vue"] as const;

export type HighlightLang = (typeof LANGS)[number];

const ALIASES: Record<string, HighlightLang> = {
  javascript: "javascript",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
  vue: "vue",
};

export const THEME = "github-dark-default";

export const toHighlightLang = (lang: string): HighlightLang =>
  ALIASES[lang.toLowerCase()] ?? "typescript";

let cached: Promise<HighlighterCore> | null = null;

export const loadHighlighter = async (): Promise<HighlighterCore> => {
  cached ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine(),
    langs: [
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/jsx"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/vue"),
    ],
    themes: [import("@shikijs/themes/github-dark-default")],
  });
  const highlighter = await cached;

  return highlighter;
};
