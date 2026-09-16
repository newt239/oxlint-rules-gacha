import { describe, expect, it } from "vitest";

import { applyFilter, DEFAULT_FILTER, draw } from "./draw";

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

const pool = [rule("eslint/a"), rule("eslint/b"), rule("unicorn/c")];

describe("draw", () => {
  it("未所持のルールを優先して返す", () => {
    const collected = new Set(["eslint/a", "eslint/b"]);

    expect(draw(pool, collected, () => 0)?.id).toBe("unicorn/c");
    expect(draw(pool, collected, () => 0.99)?.id).toBe("unicorn/c");
  });

  it("母集団が空のときは null を返す", () => {
    expect(draw([], new Set(), () => 0)).toBeNull();
  });

  it("すべて所持済みなら母集団全体から一様に選ぶ", () => {
    const collected = new Set(pool.map((entry) => entry.id));

    expect(draw(pool, collected, () => 0)?.id).toBe("eslint/a");
    expect(draw(pool, collected, () => 0.99)?.id).toBe("unicorn/c");
  });

  it("未所持がひとつでもあれば所持済みは選ばれない", () => {
    const collected = new Set(["eslint/a"]);
    const drawn = [0, 0.4, 0.5, 0.99].map((value) => draw(pool, collected, () => value)?.id);

    expect(drawn).not.toContain("eslint/a");
  });
});

describe("applyFilter", () => {
  it("既定では何も除外しない", () => {
    const rules = [rule("eslint/a"), rule("oxc/b", { category: "nursery" })];

    expect(applyFilter(rules, DEFAULT_FILTER).map((entry) => entry.id)).toStrictEqual([
      "eslint/a",
      "oxc/b",
    ]);
  });

  it("除外したプラグインを母集団から外す", () => {
    const filter = { excludedCategories: [], excludedPlugins: ["unicorn"] };

    expect(applyFilter(pool, filter).map((entry) => entry.id)).toStrictEqual([
      "eslint/a",
      "eslint/b",
    ]);
  });
});
