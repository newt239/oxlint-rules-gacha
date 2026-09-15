import { CATEGORIES, type Category, type RuleIndexEntry } from "./rules";

import type { Collection } from "./collection";

export const COLLECTION_SORTS = ["obtained", "plugin", "category"] as const;

export type CollectionSort = (typeof COLLECTION_SORTS)[number];

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

type CollectionEntry = {
  category: Category;
  count: number;
  firstAt: number;
  id: string;
  name: string;
  obtained: boolean;
  plugin: string;
};

export type CollectionSection =
  | { category: Category; entries: CollectionEntry[]; kind: "category" }
  | { entries: CollectionEntry[]; kind: "obtained" }
  | { entries: CollectionEntry[]; kind: "plugin"; plugin: string };

const compare = (left: string, right: string): number => {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
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

const pluginNames = (rules: readonly RuleIndexEntry[]): string[] =>
  [...new Set(rules.map((rule) => rule.plugin))].toSorted();

export const collectionProgress = (
  rules: readonly RuleIndexEntry[],
  collection: Collection,
): CollectionProgress => {
  const entries = rules.map((rule) => toEntry(rule, collection));
  const known = new Set(rules.map((rule) => rule.id));

  const tally = (
    keys: readonly string[],
    pick: (entry: CollectionEntry) => string,
  ): ProgressItem[] =>
    keys
      .map((key) => {
        const matched = entries.filter((entry) => pick(entry) === key);

        return {
          key,
          obtained: matched.filter((entry) => entry.obtained).length,
          total: matched.length,
        };
      })
      .filter((item) => item.total > 0);

  return {
    byCategory: tally(CATEGORIES, (entry) => entry.category),
    byPlugin: tally(pluginNames(rules), (entry) => entry.plugin),
    obtained: entries.filter((entry) => entry.obtained).length,
    retired: Object.keys(collection.obtained)
      .filter((id) => !known.has(id))
      .toSorted(),
    total: entries.length,
  };
};

export const collectionSections = (
  rules: readonly RuleIndexEntry[],
  collection: Collection,
  sort: CollectionSort,
): CollectionSection[] => {
  const entries = rules.map((rule) => toEntry(rule, collection)).filter((entry) => entry.obtained);

  const sections = ((): CollectionSection[] => {
    if (sort === "plugin") {
      return pluginNames(rules).map((plugin): CollectionSection => ({
        entries: entries
          .filter((entry) => entry.plugin === plugin)
          .toSorted((left, right) => compare(left.name, right.name)),
        kind: "plugin",
        plugin,
      }));
    }

    if (sort === "category") {
      return CATEGORIES.map((category): CollectionSection => ({
        category,
        entries: entries
          .filter((entry) => entry.category === category)
          .toSorted((left, right) => compare(left.id, right.id)),
        kind: "category",
      }));
    }

    return [
      {
        entries: entries.toSorted((left, right) => right.firstAt - left.firstAt),
        kind: "obtained",
      },
    ];
  })();

  return sections.filter((section) => section.entries.length > 0);
};
