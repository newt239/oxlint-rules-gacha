import { describe, expect, it } from "vitest";

import { toPluginId } from "./plugin-id.mts";

describe("toPluginId", () => {
  it("アンダースコアのディレクトリ名を oxlint のプラグイン ID に変換する", () => {
    expect(toPluginId("jsx_a11y")).toBe("jsx-a11y");
    expect(toPluginId("react_perf")).toBe("react-perf");
  });

  it("変換が不要なプラグインはそのまま返す", () => {
    expect(toPluginId("eslint")).toBe("eslint");
    expect(toPluginId("typescript")).toBe("typescript");
  });
});
