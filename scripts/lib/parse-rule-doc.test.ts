import { describe, expect, it } from "vitest";

import { parseRuleDoc } from "./parse-rule-doc";

const noDebugger = [
  "---",
  "url: /docs/guide/usage/linter/rules/eslint/no-debugger.md",
  "---",
  "",
  "### What it does",
  "",
  "Checks for usage of the `debugger` statement.",
  "",
  "### Why is this bad?",
  "",
  "`debugger` statements do not affect functionality when a debugger isn't attached.",
  "They're most commonly an accidental debugging leftover.",
  "",
  "### Examples",
  "",
  "Examples of **incorrect** code for this rule:",
  "",
  "```javascript",
  "debugger;",
  "```",
  "",
  "Examples of **correct** code for this rule:",
  "",
  "```javascript",
  "const x = 1;",
  "```",
  "",
  "## Configuration",
  "",
  "### fixToUnknown",
  "",
  "type: `boolean`",
  "",
  "## Version",
  "",
  "This rule was added in v0.0.3.",
  "",
].join("\n");

const noCycle = [
  "---",
  "url: /docs/guide/usage/linter/rules/import/no-cycle.md",
  "---",
  "",
  "### What it does",
  "",
  "Disallow cyclic dependencies. The rule ensures that there is no resolvable path back",
  "to this module via its dependencies.",
  "",
  "### Examples",
  "",
  "Examples of **incorrect** code for this rule:",
  "",
  "```javascript",
  'import "./dep-a.js";',
  "```",
  "",
  "```javascript",
  'import { b } from "./dep-b.js";',
  "```",
  "",
  "Examples of **correct** code for this rule:",
  "",
  "```typescript",
  "export const b = () => {};",
  "```",
  "",
  "## How to use",
  "",
].join("\n");

const initDeclarations = [
  "---",
  "url: /x.md",
  "---",
  "",
  "### What it does",
  "",
  "Require or disallow initialization in variable declarations.",
  "",
  "### Examples",
  "",
  'Examples of incorrect code for the default `"always"` option:',
  "",
  "```js",
  "var foo;",
  "```",
  "",
].join("\n");

const anchorIsValid = [
  "---",
  "url: /x.md",
  "---",
  "",
  "### What it does",
  "",
  "Enforce valid anchors.",
  "",
  "### Examples",
  "",
  "Examples of **valid** code for this rule:",
  "",
  "```jsx",
  '<a href="/home">Home</a>',
  "```",
  "",
  "Examples of **invalid** code for this rule:",
  "",
  "```jsx",
  "<a>Home</a>",
  "```",
  "",
].join("\n");

const consistentTestIt = [
  "---",
  "url: /x.md",
  "---",
  "",
  "### What it does",
  "",
  "Enforce a consistent test function.",
  "",
  "## Configuration",
  "",
  "### fn",
  "",
  "#### Examples of **incorrect** code for this rule:",
  "",
  "```javascript",
  'it("foo", () => {});',
  "```",
  "",
  "## How to use",
  "",
  "## Version",
  "",
].join("\n");

describe("parseRuleDoc", () => {
  it("要約・悪い例・良い例を取り出す", () => {
    const doc = parseRuleDoc(noDebugger);

    expect(doc.summary).toBe("Checks for usage of the debugger statement.");
    expect(doc.incorrect).toStrictEqual([{ code: "debugger;", lang: "javascript" }]);
    expect(doc.correct).toStrictEqual([{ code: "const x = 1;", lang: "javascript" }]);
  });

  it("説明は 2 見出し以降を含まない Markdown 原文にする", () => {
    const doc = parseRuleDoc(noDebugger);

    expect(doc.description.startsWith("### What it does")).toBe(true);
    expect(doc.description).not.toContain("## Configuration");
    expect(doc.description).not.toContain("This rule was added in");
  });

  it("折り返された要約を 1 行にまとめる", () => {
    expect(parseRuleDoc(noCycle).summary).toBe(
      "Disallow cyclic dependencies. The rule ensures that there is no resolvable path back to this module via its dependencies.",
    );
  });

  it("コードフェンスが複数あってもすべて拾う", () => {
    const doc = parseRuleDoc(noCycle);

    expect(doc.incorrect).toHaveLength(2);
    expect(doc.correct).toStrictEqual([{ code: "export const b = () => {};", lang: "typescript" }]);
  });

  it("該当セクションが無い場合は空で返す", () => {
    const doc = parseRuleDoc(["---", "url: /x.md", "---", "", "## Version", ""].join("\n"));

    expect(doc.summary).toBe("");
    expect(doc.incorrect).toStrictEqual([]);
    expect(doc.correct).toStrictEqual([]);
  });

  it("太字が無い見出し文でも悪い例として拾う", () => {
    expect(parseRuleDoc(initDeclarations).incorrect).toStrictEqual([
      { code: "var foo;", lang: "js" },
    ]);
  });

  it("valid / invalid という言い回しも correct / incorrect として扱う", () => {
    const doc = parseRuleDoc(anchorIsValid);

    expect(doc.incorrect).toStrictEqual([{ code: "<a>Home</a>", lang: "jsx" }]);
    expect(doc.correct).toStrictEqual([{ code: '<a href="/home">Home</a>', lang: "jsx" }]);
  });

  it("Configuration 配下の見出し形式の例も拾うが、説明には含めない", () => {
    const doc = parseRuleDoc(consistentTestIt);

    expect(doc.incorrect).toStrictEqual([{ code: 'it("foo", () => {});', lang: "javascript" }]);
    expect(doc.description).not.toContain("## Configuration");
  });
});

describe("parseRuleDoc の要約", () => {
  it("リンク・コード・強調の記法を落として平文にする", () => {
    const markdown = [
      "---",
      "url: /x.md",
      "---",
      "",
      "### What it does",
      "",
      "Disallows confusing uses of [`Array#with()`](https://example.com/with).",
      "",
    ].join("\n");

    expect(parseRuleDoc(markdown).summary).toBe("Disallows confusing uses of Array#with().");
  });
});
