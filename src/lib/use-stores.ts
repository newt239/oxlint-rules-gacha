"use client";

import { useSyncExternalStore } from "react";

import { collectionStore, filterStore, skipHintStore } from "./stores";

import type { Collection } from "./collection";
import type { Filter } from "./draw";

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
