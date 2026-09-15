import { rawRuleMetadataSchema, type RawRuleMetadata } from "./rule-schema.mts";

const THEME_CHUNK_PATTERN = /["'](?<path>\/assets\/chunks\/theme\.[\w-]+\.js)["']/u;

const RULE_OBJECT_PATTERN = /\{"scope":.*?"docs_url":"[^"]*"\}/gu;

const DOC_SEGMENT_TO_PLUGIN_ID: Record<string, string> = {
  jsx_a11y: "jsx-a11y",
  react_perf: "react-perf",
};

export const toPluginId = (docSegment: string): string =>
  DOC_SEGMENT_TO_PLUGIN_ID[docSegment] ?? docSegment;

export const extractThemeChunkPath = (html: string): string => {
  const path = THEME_CHUNK_PATTERN.exec(html)?.groups?.path;

  if (path === undefined) {
    throw new Error("ルール一覧ページから theme チャンクの URL を見つけられませんでした。");
  }

  return path;
};

export const parseRuleMetadata = (chunk: string): RawRuleMetadata[] => {
  const matches = chunk.match(RULE_OBJECT_PATTERN) ?? [];

  if (matches.length === 0) {
    throw new Error("theme チャンクからルールのメタデータを 1 件も抽出できませんでした。");
  }

  return matches.map((match) => rawRuleMetadataSchema.parse(JSON.parse(match)));
};
