"use client";

import { useSyncExternalStore } from "react";

import { type Collection, obtainedIds, recordDraw } from "./collection";
import { applyFilter, draw, type Filter } from "./draw";
import { ruleHref, type RuleHref } from "./rule-href";
import { loadRuleIndex } from "./rule-index-cache";
import { collectionStore, filterStore, skipHintStore } from "./stores";

export const useCollection = (): Collection =>
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
  collection: Collection,
  filter: Filter,
): Promise<RuleHref | null> => {
  const { rules, rulesetVersion } = await loadRuleIndex();
  const picked = draw(applyFilter(rules, filter), new Set(obtainedIds(collection)), Math.random);

  if (picked === null) {
    return null;
  }

  collectionStore.set(recordDraw(collection, picked.id, { now: Date.now(), rulesetVersion }));

  return ruleHref(lang, picked.plugin, picked.name);
};
