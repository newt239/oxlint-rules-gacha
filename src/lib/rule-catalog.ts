import rules from "#/generated/rules.json";

import { toCategory, toFixStatus, type RuleDetail } from "./rules";

type RawRuleDetail = Omit<RuleDetail, "category" | "fix"> & { category: string; fix: string };

const CATALOG: Record<string, RawRuleDetail> = rules;

export const RULE_IDS = Object.keys(CATALOG);

export const ruleParams = (): { plugin: string; rule: string }[] =>
  RULE_IDS.map((id) => {
    const [plugin = "", rule = ""] = id.split("/");

    return { plugin, rule };
  });

export const findRuleDetail = (plugin: string, name: string): RuleDetail | undefined => {
  const id = `${plugin}/${name}`;

  if (!Object.hasOwn(CATALOG, id)) {
    return undefined;
  }

  const raw = CATALOG[id];

  const category = toCategory(raw.category);
  const fix = toFixStatus(raw.fix);

  if (category === undefined || fix === undefined) {
    return undefined;
  }

  return { ...raw, category, fix };
};
