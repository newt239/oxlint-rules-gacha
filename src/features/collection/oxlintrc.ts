export type OxlintrcRule = {
  id: string;
  plugin: string;
};

const SCHEMA_PATH = "./node_modules/oxlint/configuration_schema.json";

export const buildOxlintrc = (rules: readonly OxlintrcRule[]): string => {
  const ids = [...new Set(rules.map((rule) => rule.id))].toSorted();
  const plugins = [...new Set(rules.map((rule) => rule.plugin))].toSorted();
  const severities: Record<string, string> = {};

  for (const id of ids) {
    severities[id] = "error";
  }

  const config = {
    $schema: SCHEMA_PATH,
    categories: { correctness: "off" },
    plugins,
    rules: severities,
  };

  return `${JSON.stringify(config, null, 2)}\n`;
};
