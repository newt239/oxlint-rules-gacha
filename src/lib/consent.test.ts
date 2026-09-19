import { describe, expect, it } from "vitest";

import { reviveConsent } from "./consent";

describe("reviveConsent", () => {
  it("既知の同意状態はそのまま返す", () => {
    expect(reviveConsent("granted")).toBe("granted");
    expect(reviveConsent("denied")).toBe("denied");
    expect(reviveConsent("unset")).toBe("unset");
  });

  it("未知の値には null を返す", () => {
    expect(reviveConsent("yes")).toBeNull();
    expect(reviveConsent(true)).toBeNull();
    expect(reviveConsent(null)).toBeNull();
    expect(reviveConsent({ analytics: "granted" })).toBeNull();
  });
});
