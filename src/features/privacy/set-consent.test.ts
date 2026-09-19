import { describe, expect, it } from "vitest";

import { cookieDomainCandidates } from "./set-consent";

describe("cookieDomainCandidates", () => {
  it("サブドメインから登録可能ドメインまでを並べる", () => {
    expect(cookieDomainCandidates("oxlint-gacha.newt239.dev")).toStrictEqual([
      "oxlint-gacha.newt239.dev",
      "newt239.dev",
    ]);
  });

  it("TLD 単体は候補に含めない", () => {
    expect(cookieDomainCandidates("example.com")).toStrictEqual(["example.com"]);
  });

  it("ドットを含まないホスト名には候補がない", () => {
    expect(cookieDomainCandidates("localhost")).toStrictEqual([]);
  });
});
