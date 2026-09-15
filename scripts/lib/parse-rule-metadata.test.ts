import { describe, expect, it } from "vitest";

import { extractThemeChunkPath, parseRuleMetadata } from "./parse-rule-metadata";

const RULE_OBJECT = [
  '{"scope":"eslint","value":"no-debugger","category":"correctness","version":"0.0.3",',
  '"type_aware":false,"fix":"fixable_suggestion","default":true,',
  '"docs_url":"https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-debugger.html"}',
].join("");

describe("extractThemeChunkPath", () => {
  it("modulepreload の href から theme チャンクのパスを取り出す", () => {
    const html = '<link rel="modulepreload" href="/assets/chunks/theme.Q3-5X55s.js">';

    expect(extractThemeChunkPath(html)).toBe("/assets/chunks/theme.Q3-5X55s.js");
  });

  it("見つからない場合は例外を投げる", () => {
    expect(() => extractThemeChunkPath("<html></html>")).toThrow();
  });
});

describe("parseRuleMetadata", () => {
  it("チャンクからルールのメタデータを抽出する", () => {
    expect(parseRuleMetadata(`var r=[${RULE_OBJECT}];`)).toStrictEqual([
      {
        category: "correctness",
        default: true,
        docs_url: "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-debugger.html",
        fix: "fixable_suggestion",
        scope: "eslint",
        type_aware: false,
        value: "no-debugger",
        version: "0.0.3",
      },
    ]);
  });

  it("1 件も抽出できない場合は例外を投げる", () => {
    expect(() => parseRuleMetadata("var r=[];")).toThrow();
  });

  it("知らないカテゴリが来た場合は例外を投げる", () => {
    expect(() => parseRuleMetadata(RULE_OBJECT.replace("correctness", "unknown"))).toThrow();
  });
});
