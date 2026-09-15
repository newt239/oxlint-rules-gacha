import type { Category, RuleIndexEntry } from "./rules";

export type Filter = {
  excludedCategories: Category[];
  excludedPlugins: string[];
};

export const DEFAULT_FILTER: Filter = { excludedCategories: ["nursery"], excludedPlugins: [] };

export const applyFilter = (rules: readonly RuleIndexEntry[], filter: Filter): RuleIndexEntry[] =>
  rules.filter(
    (rule) =>
      !filter.excludedCategories.includes(rule.category) &&
      !filter.excludedPlugins.includes(rule.plugin),
  );

export const draw = (
  pool: readonly RuleIndexEntry[],
  collected: ReadonlySet<string>,
  random: () => number,
): RuleIndexEntry | null => {
  if (pool.length === 0) {
    return null;
  }

  const undrawn = pool.filter((rule) => !collected.has(rule.id));
  const candidates = undrawn.length > 0 ? undrawn : pool;

  return candidates[Math.floor(random() * candidates.length)] ?? null;
};
