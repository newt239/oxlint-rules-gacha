import { describe, expect, it } from "vitest";

import { buildOxlintrc } from "./oxlintrc";

const parse = (source: string): unknown => JSON.parse(source);

describe("buildOxlintrc", () => {
  it("所持ルールだけを rules に並べた JSON を返す", () => {
    const config = parse(
      buildOxlintrc([
        { id: "react/jsx-key", plugin: "react" },
        { id: "eslint/eqeqeq", plugin: "eslint" },
      ]),
    );

    expect(config).toStrictEqual({
      $schema: "./node_modules/oxlint/configuration_schema.json",
      categories: { correctness: "off" },
      plugins: ["eslint", "react"],
      rules: { "eslint/eqeqeq": "error", "react/jsx-key": "error" },
    });
  });

  it("plugins を重複なく昇順で並べる", () => {
    const config = parse(
      buildOxlintrc([
        { id: "unicorn/no-null", plugin: "unicorn" },
        { id: "eslint/eqeqeq", plugin: "eslint" },
        { id: "unicorn/prefer-at", plugin: "unicorn" },
      ]),
    );

    expect(config).toHaveProperty("plugins", ["eslint", "unicorn"]);
  });

  it("rules のキーを ID 昇順で並べる", () => {
    const source = buildOxlintrc([
      { id: "unicorn/no-null", plugin: "unicorn" },
      { id: "eslint/eqeqeq", plugin: "eslint" },
      { id: "jsx-a11y/alt-text", plugin: "jsx-a11y" },
    ]);

    expect(source.indexOf("eslint/eqeqeq")).toBeLessThan(source.indexOf("jsx-a11y/alt-text"));
    expect(source.indexOf("jsx-a11y/alt-text")).toBeLessThan(source.indexOf("unicorn/no-null"));
  });

  it("所持 0 件でも妥当な JSON を返す", () => {
    const config = parse(buildOxlintrc([]));

    expect(config).toStrictEqual({
      $schema: "./node_modules/oxlint/configuration_schema.json",
      categories: { correctness: "off" },
      plugins: [],
      rules: {},
    });
  });

  it("末尾に改行を付ける", () => {
    expect(buildOxlintrc([{ id: "eslint/eqeqeq", plugin: "eslint" }]).endsWith("}\n")).toBe(true);
  });
});
