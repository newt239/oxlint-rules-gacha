import { fetchRuleIndex, type RuleIndexEntry } from "./rules";

let cached: Promise<RuleIndexEntry[]> | null = null;

export const loadRuleIndex = async (): Promise<RuleIndexEntry[]> => {
  cached ??= fetchRuleIndex();
  const index = await cached;

  return index;
};
