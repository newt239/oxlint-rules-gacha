import { CATEGORIES, type Category, type RuleIndexEntry } from "#/lib/rules";

import type { Collection } from "#/lib/collection";

type ProgressItem = {
  key: string;
  obtained: number;
  total: number;
};

export type CollectionProgress = {
  byCategory: ProgressItem[];
  byPlugin: ProgressItem[];
  obtained: number;
  retired: string[];
  total: number;
};

export type CollectionEntry = {
  category: Category;
  count: number;
  firstAt: number;
  id: string;
  name: string;
  obtained: boolean;
  plugin: string;
};

const toEntry = (rule: RuleIndexEntry, collection: Collection): CollectionEntry => {
  const owned = Object.hasOwn(collection.obtained, rule.id);
  const entry = owned ? collection.obtained[rule.id] : { count: 0, firstAt: 0 };

  return {
    category: rule.category,
    count: entry.count,
    firstAt: entry.firstAt,
    id: rule.id,
    name: rule.name,
    obtained: owned,
    plugin: rule.plugin,
  };
};

export const collectionProgress = (
  rules: readonly RuleIndexEntry[],
  collection: Collection,
): CollectionProgress => {
  const entries = rules.map((rule) => toEntry(rule, collection));
  const known = new Set(rules.map((rule) => rule.id));

  const tally = (keys: readonly string[], field: "category" | "plugin"): ProgressItem[] =>
    keys
      .map((key) => {
        const matched = entries.filter((entry) => entry[field] === key);

        return {
          key,
          obtained: matched.filter((entry) => entry.obtained).length,
          total: matched.length,
        };
      })
      .filter((item) => item.total > 0);

  return {
    byCategory: tally(CATEGORIES, "category"),
    byPlugin: tally([...new Set(rules.map((rule) => rule.plugin))].toSorted(), "plugin"),
    obtained: entries.filter((entry) => entry.obtained).length,
    retired: Object.keys(collection.obtained)
      .filter((id) => !known.has(id))
      .toSorted(),
    total: entries.length,
  };
};

export const obtainedEntries = (
  rules: readonly RuleIndexEntry[],
  collection: Collection,
): CollectionEntry[] =>
  rules
    .map((rule) => toEntry(rule, collection))
    .filter((entry) => entry.obtained)
    .toSorted((left, right) => right.firstAt - left.firstAt);
