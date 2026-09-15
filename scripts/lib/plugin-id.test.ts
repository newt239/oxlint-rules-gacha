import { describe, expect, it } from "vitest";

import { toDocSegment, toPluginId } from "./plugin-id";

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

describe("toDocSegment", () => {
  it("プラグイン ID をドキュメントのディレクトリ名に戻す", () => {
    expect(toDocSegment("jsx-a11y")).toBe("jsx_a11y");
    expect(toDocSegment("react-perf")).toBe("react_perf");
  });

  it("変換が不要なプラグインはそのまま返す", () => {
    expect(toDocSegment("unicorn")).toBe("unicorn");
  });
});
