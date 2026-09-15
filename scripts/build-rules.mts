import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { parseRuleDoc } from "./lib/parse-rule-doc.mts";
import {
  extractThemeChunkPath,
  parseRuleMetadata,
  toPluginId,
} from "./lib/parse-rule-metadata.mts";
import { ruleDetailSchema, toFixStatus, type RuleDetail } from "./lib/rule-schema.mts";

const DOCS_ORIGIN = "https://oxc.rs";
const RULES_PAGE_URL = `${DOCS_ORIGIN}/docs/guide/usage/linter/rules.html`;
const CONCURRENCY = 4;
const MISSING_SUMMARY_THRESHOLD = 5;
const MISSING_INCORRECT_THRESHOLD = 40;

const OXLINT_DIR = path.join(process.cwd(), "node_modules", "oxlint");
const INDEX_PATH = path.join(process.cwd(), "public", "data", "rules.index.json");
const GENERATED_DIR = path.join(process.cwd(), "src", "generated");
const RULES_PATH = path.join(GENERATED_DIR, "rules.json");

const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} の取得に失敗しました: ${response.status}`);
  }

  return response.text();
};

const ruleMapProperties = (schema: unknown): string[] => {
  if (
    typeof schema !== "object" ||
    schema === null ||
    !("definitions" in schema) ||
    typeof schema.definitions !== "object" ||
    schema.definitions === null ||
    !("DummyRuleMap" in schema.definitions) ||
    typeof schema.definitions.DummyRuleMap !== "object" ||
    schema.definitions.DummyRuleMap === null ||
    !("properties" in schema.definitions.DummyRuleMap) ||
    typeof schema.definitions.DummyRuleMap.properties !== "object" ||
    schema.definitions.DummyRuleMap.properties === null
  ) {
    throw new Error("oxlint の configuration_schema.json からルール一覧を読み取れませんでした。");
  }

  return Object.keys(schema.definitions.DummyRuleMap.properties);
};

const readInstalledRuleIds = async (): Promise<Set<string>> => {
  const schema: unknown = JSON.parse(
    await readFile(path.join(OXLINT_DIR, "configuration_schema.json"), "utf8"),
  );
  const properties = ruleMapProperties(schema);

  return new Set(properties.map((key) => (key.includes("/") ? key : `eslint/${key}`)));
};

const readRulesetVersion = async (): Promise<string> => {
  const manifest: unknown = JSON.parse(
    await readFile(path.join(OXLINT_DIR, "package.json"), "utf8"),
  );

  if (
    typeof manifest !== "object" ||
    manifest === null ||
    !("version" in manifest) ||
    typeof manifest.version !== "string"
  ) {
    throw new Error("oxlint のバージョンを読み取れませんでした。");
  }

  return manifest.version;
};

const assertSameRules = (installed: Set<string>, fetched: Set<string>): void => {
  const missing = [...installed].filter((id) => !fetched.has(id));
  const extra = [...fetched].filter((id) => !installed.has(id));

  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      [
        `ルール一覧が oxlint の同梱スキーマ（${installed.size} 件）と一致しません（取得 ${fetched.size} 件）。`,
        missing.length > 0 ? `ドキュメントに無い: ${missing.join(", ")}` : "",
        extra.length > 0 ? `oxlint に無い: ${extra.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
};

const mapWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = Array.from({ length: items.length });
  let cursor = 0;

  const run = async (): Promise<void> => {
    const index = cursor;

    if (index >= items.length) {
      return;
    }

    cursor += 1;
    const item = items[index];

    if (item !== undefined) {
      results[index] = await worker(item);
    }

    return run();
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));

  return results;
};

const main = async () => {
  const [rulesetVersion, installedRuleIds] = await Promise.all([
    readRulesetVersion(),
    readInstalledRuleIds(),
  ]);
  console.log(`oxlint ${rulesetVersion} の ${installedRuleIds.size} 件を基準にします`);

  const themeChunkPath = extractThemeChunkPath(await fetchText(RULES_PAGE_URL));
  const metadata = parseRuleMetadata(await fetchText(`${DOCS_ORIGIN}${themeChunkPath}`));
  assertSameRules(
    installedRuleIds,
    new Set(metadata.map((rule) => `${toPluginId(rule.scope)}/${rule.value}`)),
  );

  console.log(`${metadata.length} 件のドキュメントを ${CONCURRENCY} 並列で取得します`);
  const details = await mapWithConcurrency(
    metadata,
    CONCURRENCY,
    async (rule): Promise<RuleDetail> => {
      const plugin = toPluginId(rule.scope);
      const markdown = await fetchText(
        `${DOCS_ORIGIN}/docs/guide/usage/linter/rules/${rule.scope}/${rule.value}.md`,
      );
      const doc = parseRuleDoc(markdown);

      return ruleDetailSchema.parse({
        category: rule.category,
        correct: doc.correct,
        default: rule.default,
        description: doc.description,
        docsUrl: rule.docs_url,
        fix: toFixStatus(rule.fix),
        id: `${plugin}/${rule.value}`,
        incorrect: doc.incorrect,
        name: rule.value,
        plugin,
        summary: doc.summary,
        typeAware: rule.type_aware,
        version: rule.version,
      });
    },
  );

  const withoutSummary = details.filter((rule) => rule.summary === "");
  const withoutIncorrect = details.filter((rule) => rule.incorrect.length === 0);
  console.log(`要約なし ${withoutSummary.length} 件 / 悪い例なし ${withoutIncorrect.length} 件`);

  if (
    withoutSummary.length > MISSING_SUMMARY_THRESHOLD ||
    withoutIncorrect.length > MISSING_INCORRECT_THRESHOLD
  ) {
    throw new Error(
      "要約または悪い例を取得できないルールが多すぎます。oxc.rs 側の構造が変わった可能性があります。",
    );
  }

  await mkdir(path.dirname(INDEX_PATH), { recursive: true });
  await mkdir(GENERATED_DIR, { recursive: true });

  await writeFile(
    INDEX_PATH,
    `${JSON.stringify({
      rules: details.map((rule) => [rule.id, rule.category, rule.fix, rule.default ? 1 : 0]),
      rulesetVersion,
    })}\n`,
  );
  const catalog = Object.fromEntries(details.map((rule) => [rule.id, rule]));
  await writeFile(RULES_PATH, `${JSON.stringify(catalog)}\n`);

  console.log(`${details.length} 件のルールを ${INDEX_PATH} と ${RULES_PATH} に書き出しました`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
