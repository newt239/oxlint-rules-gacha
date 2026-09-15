import { describe, expect, it } from "vitest";

import { collectionProgress, obtainedEntries } from "./collection-progress";

import type { Collection } from "#/lib/collection";
import type { RuleIndexEntry } from "#/lib/rules";

const rule = (id: string, overrides: Partial<RuleIndexEntry> = {}): RuleIndexEntry => {
  const [plugin = "", name = ""] = id.split("/");

  return {
    category: "correctness",
    enabledByDefault: true,
    fix: "none",
    id,
    name,
    plugin,
    ...overrides,
  };
};

const RULES = [
  rule("eslint/eqeqeq"),
  rule("eslint/no-console", { category: "pedantic" }),
  rule("react/jsx-key", { category: "suspicious" }),
];

const collection = (obtained: Collection["obtained"]): Collection => ({
  obtained,
  rulesetVersion: "1.80.0",
  version: 1,
});

describe("collectionProgress", () => {
  it("プラグイン別の達成率を数える", () => {
    const progress = collectionProgress(
      RULES,
      collection({ "eslint/eqeqeq": { count: 1, firstAt: 1 } }),
    );

    expect(progress.byPlugin).toStrictEqual([
      { key: "eslint", obtained: 1, total: 2 },
      { key: "react", obtained: 0, total: 1 },
    ]);
  });

  it("カテゴリ別の達成率を CATEGORIES 順で返す", () => {
    const progress = collectionProgress(
      RULES,
      collection({ "react/jsx-key": { count: 1, firstAt: 1 } }),
    );

    expect(progress.byCategory).toStrictEqual([
      { key: "correctness", obtained: 0, total: 1 },
      { key: "suspicious", obtained: 1, total: 1 },
      { key: "pedantic", obtained: 0, total: 1 },
    ]);
  });

  it("インデックスに無い所持ルールを retired に分け達成率に含めない", () => {
    const progress = collectionProgress(
      RULES,
      collection({
        "eslint/eqeqeq": { count: 1, firstAt: 1 },
        "eslint/removed-rule": { count: 1, firstAt: 2 },
      }),
    );

    expect(progress.retired).toStrictEqual(["eslint/removed-rule"]);
    expect(progress.obtained).toBe(1);
    expect(progress.total).toBe(3);
  });
});

describe("obtainedEntries", () => {
  it("firstAt の降順に並べ未所持を含めない", () => {
    const entries = obtainedEntries(
      RULES,
      collection({
        "eslint/eqeqeq": { count: 1, firstAt: 100 },
        "react/jsx-key": { count: 1, firstAt: 200 },
      }),
    );

    expect(entries.map((entry) => entry.id)).toStrictEqual(["react/jsx-key", "eslint/eqeqeq"]);
  });

  it("何も所持していなければ空になる", () => {
    expect(obtainedEntries(RULES, collection({}))).toStrictEqual([]);
  });
});
