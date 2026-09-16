import { describe, expect, it } from "vitest";

import {
  EMPTY_COLLECTION,
  hasObtained,
  obtainedIds,
  recordDraw,
  reviveCollection,
} from "./collection";

describe("reviveCollection", () => {
  it("壊れたエントリだけを捨てて残りは保持する", () => {
    const revived = reviveCollection({
      obtained: {
        "eslint/eqeqeq": { count: 2, firstAt: 100 },
        "react/jsx-key": { count: "たくさん" },
      },
      rulesetVersion: "1.80.0",
      version: 1,
    });

    expect(revived).toStrictEqual({
      obtained: { "eslint/eqeqeq": { count: 2, firstAt: 100 } },
      rulesetVersion: "1.80.0",
      version: 1,
    });
  });

  it("version が未知でも obtained が読めれば取り込む", () => {
    const revived = reviveCollection({
      obtained: { "eslint/eqeqeq": { count: 1, firstAt: 1 } },
      rulesetVersion: "2.0.0",
      version: 99,
    });

    expect(obtainedIds(revived ?? EMPTY_COLLECTION)).toStrictEqual(["eslint/eqeqeq"]);
  });

  it("obtained を読み取れない値には null を返す", () => {
    expect(reviveCollection("こわれたデータ")).toBeNull();
    expect(reviveCollection(null)).toBeNull();
    expect(reviveCollection(["eslint/eqeqeq"])).toBeNull();
  });

  it("obtained を持たないオブジェクトには null を返す", () => {
    expect(reviveCollection({ rulesetVersion: "1.80.0", version: 1 })).toBeNull();
  });
});

describe("recordDraw", () => {
  it("初回は count 1 と firstAt を記録する", () => {
    const next = recordDraw(EMPTY_COLLECTION, "eslint/eqeqeq", {
      now: 1700,
      rulesetVersion: "1.80.0",
    });

    expect(next.obtained["eslint/eqeqeq"]).toStrictEqual({ count: 1, firstAt: 1700 });
    expect(next.rulesetVersion).toBe("1.80.0");
  });

  it("2 回目は count だけ増やして firstAt を変えない", () => {
    const first = recordDraw(EMPTY_COLLECTION, "eslint/eqeqeq", {
      now: 1700,
      rulesetVersion: "1.80.0",
    });
    const second = recordDraw(first, "eslint/eqeqeq", { now: 9900, rulesetVersion: "1.80.0" });

    expect(second.obtained["eslint/eqeqeq"]).toStrictEqual({ count: 2, firstAt: 1700 });
  });

  it("rulesetVersion が変わっても所持データを失わない", () => {
    const before = recordDraw(EMPTY_COLLECTION, "eslint/eqeqeq", {
      now: 1700,
      rulesetVersion: "1.80.0",
    });
    const after = recordDraw(before, "react/jsx-key", { now: 1800, rulesetVersion: "1.81.0" });

    expect(obtainedIds(after)).toStrictEqual(["eslint/eqeqeq", "react/jsx-key"]);
    expect(after.obtained["eslint/eqeqeq"]).toStrictEqual({ count: 1, firstAt: 1700 });
    expect(after.rulesetVersion).toBe("1.81.0");
  });

  it("EMPTY_COLLECTION を書き換えない", () => {
    recordDraw(EMPTY_COLLECTION, "eslint/eqeqeq", { now: 1700, rulesetVersion: "1.80.0" });

    expect(obtainedIds(EMPTY_COLLECTION)).toStrictEqual([]);
  });
});

describe("hasObtained", () => {
  it("prototype 由来のキーを所持扱いしない", () => {
    expect(hasObtained(EMPTY_COLLECTION, "toString")).toBe(false);
  });
});
