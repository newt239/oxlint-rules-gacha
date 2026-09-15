import { fetchRuleIndex, type RuleIndex } from "./rules";

let cached: Promise<RuleIndex> | null = null;

export const loadRuleIndex = async (): Promise<RuleIndex> => {
  cached ??= fetchRuleIndex();
  const index = await cached;

  return index;
};
