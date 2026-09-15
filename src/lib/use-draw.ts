"use client";

import { useSyncExternalStore } from "react";

import { applyFilter, draw, type Filter } from "./draw";
import { ruleHref, type RuleHref } from "./rule-href";
import { loadRuleIndex } from "./rule-index-cache";
import { collectionStore, filterStore, skipHintStore } from "./stores";

export const useCollection = (): string[] =>
  useSyncExternalStore(
    collectionStore.subscribe,
    collectionStore.getSnapshot,
    collectionStore.getServerSnapshot,
  );

export const useSkipHintSeen = (): boolean =>
  useSyncExternalStore(
    skipHintStore.subscribe,
    skipHintStore.getSnapshot,
    skipHintStore.getServerSnapshot,
  );

export const useFilter = (): Filter =>
  useSyncExternalStore(
    filterStore.subscribe,
    filterStore.getSnapshot,
    filterStore.getServerSnapshot,
  );

export const drawAndRecord = async (
  lang: string,
  collection: string[],
  filter: Filter,
): Promise<RuleHref | null> => {
  const index = await loadRuleIndex();
  const picked = draw(applyFilter(index, filter), new Set(collection), Math.random);

  if (picked === null) {
    return null;
  }

  collectionStore.set([...new Set([...collection, picked.id])]);

  return ruleHref(lang, picked.plugin, picked.name);
};
