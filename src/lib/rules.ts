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

export const fetchRuleIndex = async (): Promise<RuleIndexEntry[]> => {
  const response = await fetch(RULE_INDEX_URL);

  if (!response.ok) {
    throw new Error(`ルールインデックスの取得に失敗しました: ${response.status}`);
  }

  const payload: unknown = await response.json();
  const rows =
    typeof payload === "object" && payload !== null && "rules" in payload ? payload.rules : null;

  if (!Array.isArray(rows)) {
    throw new TypeError("ルールインデックスの形式が不正です。");
  }

  const list: unknown[] = rows;
  const entries: RuleIndexEntry[] = [];

  for (const row of list) {
    const entry = toRuleIndexEntry(row);

    if (entry !== null) {
      entries.push(entry);
    }
  }

  return entries;
};
