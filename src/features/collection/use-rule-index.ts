"use client";

import { useSyncExternalStore } from "react";

import { loadRuleIndex, type RuleIndex } from "#/lib/rules";

const listeners = new Set<() => void>();

let snapshot: RuleIndex | null = null;
let started = false;

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);

  if (!started) {
    started = true;
    loadRuleIndex()
      .then((index) => {
        snapshot = index;

        for (const current of listeners) {
          current();
        }
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }

  return () => {
    listeners.delete(listener);
  };
};

export const useRuleIndex = (): RuleIndex | null =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => null,
  );
