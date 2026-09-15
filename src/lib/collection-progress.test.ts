import { describe, expect, it } from "vitest";

import { collectionProgress, collectionSections } from "./collection-progress";

import type { Collection } from "./collection";
import type { RuleIndexEntry } from "./rules";

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

describe("collectionSections", () => {
  it("入手順は firstAt の降順に並べ未所持を含めない", () => {
    const sections = collectionSections(
      RULES,
      collection({
        "eslint/eqeqeq": { count: 1, firstAt: 100 },
        "react/jsx-key": { count: 1, firstAt: 200 },
      }),
      "obtained",
    );

    expect(sections.map((section) => section.kind)).toStrictEqual(["obtained"]);
    expect(sections[0].entries.map((entry) => entry.id)).toStrictEqual([
      "react/jsx-key",
      "eslint/eqeqeq",
    ]);
  });

  it("プラグイン順は所持ルールだけを残しプラグイン名昇順で並べる", () => {
    const sections = collectionSections(
      RULES,
      collection({ "eslint/no-console": { count: 1, firstAt: 1 } }),
      "plugin",
    );

    expect(
      sections.map((section) => (section.kind === "plugin" ? section.plugin : "")),
    ).toStrictEqual(["eslint"]);
    expect(sections[0].entries.map((entry) => entry.name)).toStrictEqual(["no-console"]);
  });

  it("カテゴリ順は所持ルールのカテゴリを CATEGORIES 順で返す", () => {
    const sections = collectionSections(
      RULES,
      collection({
        "eslint/eqeqeq": { count: 1, firstAt: 1 },
        "eslint/no-console": { count: 1, firstAt: 2 },
      }),
      "category",
    );

    expect(
      sections.map((section) => (section.kind === "category" ? section.category : "")),
    ).toStrictEqual(["correctness", "pedantic"]);
  });

  it("何も所持していなければセクションを返さない", () => {
    expect(collectionSections(RULES, collection({}), "obtained")).toStrictEqual([]);
    expect(collectionSections(RULES, collection({}), "plugin")).toStrictEqual([]);
    expect(collectionSections(RULES, collection({}), "category")).toStrictEqual([]);
  });
});
