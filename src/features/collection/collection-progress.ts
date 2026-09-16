import { type Collection, hasObtained } from "#/lib/collection";
import { CATEGORIES, type Category, type RuleIndexEntry } from "#/lib/rules";

type ProgressItem<Key extends string> = {
  key: Key;
  obtained: number;
  total: number;
};

export type CollectionProgress = {
  byCategory: ProgressItem<Category>[];
  byPlugin: ProgressItem<string>[];
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
  plugin: string;
};

export const collectionProgress = (
  rules: readonly RuleIndexEntry[],
  collection: Collection,
): CollectionProgress => {
  const known = new Set(rules.map((rule) => rule.id));
  const plugins = [...new Set(rules.map((rule) => rule.plugin))].toSorted();

  const tally = <Key extends string>(
    keys: readonly Key[],
    toKey: (rule: RuleIndexEntry) => Key,
  ): ProgressItem<Key>[] => {
    const totals = new Map<Key, ProgressItem<Key>>(
      keys.map((key) => [key, { key, obtained: 0, total: 0 }]),
    );

    for (const rule of rules) {
      const item = totals.get(toKey(rule));

      if (item !== undefined) {
        item.total += 1;
        item.obtained += hasObtained(collection, rule.id) ? 1 : 0;
      }
    }

    return [...totals.values()].filter((item) => item.total > 0);
  };

  return {
    byCategory: tally(CATEGORIES, (rule) => rule.category),
    byPlugin: tally(plugins, (rule) => rule.plugin),
    obtained: rules.filter((rule) => hasObtained(collection, rule.id)).length,
    retired: Object.keys(collection.obtained)
      .filter((id) => !known.has(id))
      .toSorted(),
    total: rules.length,
  };
};

export const obtainedEntries = (
  rules: readonly RuleIndexEntry[],
  collection: Collection,
): CollectionEntry[] =>
  rules
    .filter((rule) => hasObtained(collection, rule.id))
    .map((rule) => ({
      category: rule.category,
      count: collection.obtained[rule.id].count,
      firstAt: collection.obtained[rule.id].firstAt,
      id: rule.id,
      name: rule.name,
      plugin: rule.plugin,
    }))
    .toSorted((left, right) => right.firstAt - left.firstAt);
