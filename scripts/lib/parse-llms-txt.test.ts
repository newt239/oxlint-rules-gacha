import { describe, expect, it } from "vitest";

import { parseLlmsTxt } from "./parse-llms-txt";

describe("parseLlmsTxt", () => {
  it("リンターのルールドキュメントだけを抽出する", () => {
    const source = [
      "- [Configuration | Oxlint](/docs/guide/usage/linter/config.md)",
      "- [eslint/no-debugger | Oxlint](/docs/guide/usage/linter/rules/eslint/no-debugger.md)",
      "- [jsx_a11y/alt-text | Oxlint](/docs/guide/usage/linter/rules/jsx_a11y/alt-text.md)",
    ].join("\n");

    expect(parseLlmsTxt(source)).toStrictEqual([
      {
        docPath: "/docs/guide/usage/linter/rules/eslint/no-debugger.md",
        name: "no-debugger",
        plugin: "eslint",
      },
      {
        docPath: "/docs/guide/usage/linter/rules/jsx_a11y/alt-text.md",
        name: "alt-text",
        plugin: "jsx_a11y",
      },
    ]);
  });

  it("重複したパスを取り除く", () => {
    const source = [
      "(/docs/guide/usage/linter/rules/eslint/no-debugger.md)",
      "(/docs/guide/usage/linter/rules/eslint/no-debugger.md)",
    ].join("\n");

    expect(parseLlmsTxt(source)).toHaveLength(1);
  });

  it("ルールが 1 件も無ければ空配列を返す", () => {
    expect(parseLlmsTxt("# The JavaScript Oxidation Compiler")).toStrictEqual([]);
  });
});
