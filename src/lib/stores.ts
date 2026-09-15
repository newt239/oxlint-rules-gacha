import { type Collection, EMPTY_COLLECTION, reviveCollection } from "./collection";
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

export const collectionStore = createPersistedStore<Collection>(
  "oxlint-gacha:collection",
  EMPTY_COLLECTION,
  reviveCollection,
);

export const filterStore = createPersistedStore<Filter>(
  "oxlint-gacha:filter",
  DEFAULT_FILTER,
  reviveFilter,
);

export const skipHintStore = createPersistedStore<boolean>(
  "oxlint-gacha:skip-hint-seen",
  false,
  (value) => (typeof value === "boolean" ? value : null),
);
