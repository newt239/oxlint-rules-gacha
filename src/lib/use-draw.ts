"use client";

import { useSyncExternalStore } from "react";

import { type Collection, obtainedIds, recordDraw } from "./collection";
import { applyFilter, draw, type Filter } from "./draw";
import { loadRuleIndex } from "./rule-index-cache";
import { collectionStore, filterStore, skipHintStore } from "./stores";

import type { RuleIndexEntry } from "./rules";

export const useCollection = (): Collection =>
  useSyncExternalStore(
    collectionStore.subscribe,
    collectionStore.getSnapshot,
    collectionStore.getServerSnapshot,
  );

export const useLoadedCollection = (): Collection | null =>
  useSyncExternalStore<Collection | null>(
    collectionStore.subscribe,
    collectionStore.getSnapshot,
    () => null,
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
  collection: Collection,
  filter: Filter,
): Promise<RuleIndexEntry | null> => {
  const { rules, rulesetVersion } = await loadRuleIndex();
  const picked = draw(applyFilter(rules, filter), new Set(obtainedIds(collection)), Math.random);

  if (picked === null) {
    return null;
  }

  collectionStore.set(recordDraw(collection, picked.id, { now: Date.now(), rulesetVersion }));

  return picked;
};
