import { DEFAULT_FILTER, type Filter } from "./draw";
import { createPersistedStore } from "./persisted-store";
import { CATEGORIES } from "./rules";

const toStringArray = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  const items: unknown[] = value;

  return items.filter((item) => typeof item === "string");
};

const reviveFilter = (value: unknown): Filter | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const excludedCategories =
    "excludedCategories" in value ? toStringArray(value.excludedCategories) : null;
  const excludedPlugins = "excludedPlugins" in value ? toStringArray(value.excludedPlugins) : null;

  if (excludedCategories === null || excludedPlugins === null) {
    return null;
  }

  return {
    excludedCategories: CATEGORIES.filter((category) => excludedCategories.includes(category)),
    excludedPlugins,
  };
};

export const collectionStore = createPersistedStore<string[]>(
  "oxlint-gacha:collection",
  [],
  toStringArray,
);

export const filterStore = createPersistedStore<Filter>(
  "oxlint-gacha:filter",
  DEFAULT_FILTER,
  reviveFilter,
);
