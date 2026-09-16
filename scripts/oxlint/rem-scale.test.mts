import { describe, expect, it } from "vitest";

import { offScaleRems } from "./rem-scale.mts";

describe("offScaleRems", () => {
  it("0.25 刻みの値は返さない", () => {
    expect(offScaleRems("1rem")).toEqual([]);
    expect(offScaleRems("0.25rem")).toEqual([]);
    expect(offScaleRems("clamp(1.5rem, 6vw, 2rem)")).toEqual([]);
  });

  it("rem 以外の単位は無視する", () => {
    expect(offScaleRems("999px")).toEqual([]);
    expect(offScaleRems("4.6vw")).toEqual([]);
  });

  it("0.25 刻みでない値を返す", () => {
    expect(offScaleRems("0.8125rem")).toEqual(["0.8125"]);
    expect(offScaleRems("0.35rem")).toEqual(["0.35"]);
  });

  it("1 つの値に複数含まれていても全部返す", () => {
    expect(offScaleRems("0.7rem 1.4rem")).toEqual(["0.7", "1.4"]);
    expect(offScaleRems("1rem 2.4rem")).toEqual(["2.4"]);
  });
});
