import type { Route } from "next";

export const CATEGORIES = [
  "correctness",
  "suspicious",
  "pedantic",
  "perf",
  "style",
  "restriction",
  "nursery",
] as const;

const FIX_STATUSES = ["none", "fix", "suggestion", "dangerous"] as const;

export type Category = (typeof CATEGORIES)[number];
export type FixStatus = (typeof FIX_STATUSES)[number];

export type CodeExample = {
  code: string;
  lang: string;
};

export type RuleDetail = {
  category: Category;
  correct: CodeExample[];
  default: boolean;
  description: string;
  docsUrl: string;
  fix: FixStatus;
  id: string;
  incorrect: CodeExample[];
  name: string;
  plugin: string;
  summary: string;
  typeAware: boolean;
  version: string;
};

export type RuleIndexEntry = {
  category: Category;
  enabledByDefault: boolean;
  fix: FixStatus;
  id: string;
  name: string;
  plugin: string;
};

export type RuleIndex = {
  rules: RuleIndexEntry[];
  rulesetVersion: string;
};

const RULE_INDEX_URL = "/data/rules.index.json";

export const toCategory = (value: unknown): Category | undefined =>
  CATEGORIES.find((category) => category === value);

export const toFixStatus = (value: unknown): FixStatus | undefined =>
  FIX_STATUSES.find((fix) => fix === value);

const toRuleIndexEntry = (row: unknown): RuleIndexEntry | null => {
  if (!Array.isArray(row)) {
    return null;
  }

  const cells: unknown[] = row;
  const [id, rawCategory, rawFix, rawDefault] = cells;
  const category = toCategory(rawCategory);
  const fix = toFixStatus(rawFix);

  if (typeof id !== "string" || category === undefined || fix === undefined) {
    return null;
  }

  const [plugin = "", name = ""] = id.split("/");

  return { category, enabledByDefault: rawDefault === 1, fix, id, name, plugin };
};

export const ruleHref = (plugin: string, name: string): Route<`/rules/${string}/${string}`> =>
  `/rules/${plugin}/${name}`;

const fetchRuleIndex = async (): Promise<RuleIndex> => {
  const response = await fetch(RULE_INDEX_URL);

  if (!response.ok) {
    throw new Error(`ルールインデックスの取得に失敗しました: ${response.status}`);
  }

  const payload: unknown = await response.json();
  const isObject = typeof payload === "object" && payload !== null;
  const rows = isObject && "rules" in payload ? payload.rules : null;
  const rawVersion = isObject && "rulesetVersion" in payload ? payload.rulesetVersion : null;

  if (!Array.isArray(rows)) {
    throw new TypeError("ルールインデックスの形式が不正です。");
  }

  const list: unknown[] = rows;
  const rules: RuleIndexEntry[] = [];

  for (const row of list) {
    const entry = toRuleIndexEntry(row);

    if (entry !== null) {
      rules.push(entry);
    }
  }

  return { rules, rulesetVersion: typeof rawVersion === "string" ? rawVersion : "" };
};

let cachedIndex: Promise<RuleIndex> | null = null;

export const loadRuleIndex = async (): Promise<RuleIndex> => {
  cachedIndex ??= fetchRuleIndex();
  const index = await cachedIndex;

  return index;
};
