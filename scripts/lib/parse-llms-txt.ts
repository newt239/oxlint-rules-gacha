export type RuleDocPath = {
  plugin: string;
  name: string;
  docPath: string;
};

const RULE_DOC_PATTERN =
  /\/docs\/guide\/usage\/linter\/rules\/(?<plugin>[a-z0-9_]+)\/(?<name>[a-z0-9-]+)\.md/gu;

export const parseLlmsTxt = (source: string): RuleDocPath[] => {
  const found = new Map<string, RuleDocPath>();

  for (const match of source.matchAll(RULE_DOC_PATTERN)) {
    found.set(match[0], {
      docPath: match[0],
      name: match.groups?.name ?? "",
      plugin: match.groups?.plugin ?? "",
    });
  }

  return [...found.values()].toSorted((a, b) => a.docPath.localeCompare(b.docPath));
};
