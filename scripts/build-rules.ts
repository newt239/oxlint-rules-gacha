import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { parseLlmsTxt } from "./lib/parse-llms-txt";

const LLMS_TXT_URL = "https://oxc.rs/llms.txt";

const OUTPUT_PATH = path.join(process.cwd(), "public", "data", "rules.index.json");

const main = async () => {
  const response = await fetch(LLMS_TXT_URL);
  if (!response.ok) {
    throw new Error(`${LLMS_TXT_URL} の取得に失敗しました: ${response.status}`);
  }

  const rules = parseLlmsTxt(await response.text());
  if (rules.length === 0) {
    throw new Error(`${LLMS_TXT_URL} からルールを 1 件も抽出できませんでした`);
  }

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(
    OUTPUT_PATH,
    `${JSON.stringify({ fetchedAt: new Date().toISOString(), rules }, null, 2)}\n`,
  );

  console.log(`${rules.length} 件のルールを ${OUTPUT_PATH} に書き出しました`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
