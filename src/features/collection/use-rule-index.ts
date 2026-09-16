"use client";

import { useSyncExternalStore } from "react";

import { loadRuleIndex, type RuleIndex } from "#/lib/rules";

let snapshot: RuleIndex | null = null;

const subscribe = (listener: () => void): (() => void) => {
  let active = true;

  loadRuleIndex()
    .then((index) => {
      snapshot = index;

      if (active) {
        listener();
      }
    })
    .catch((error: unknown) => {
      console.error(error);
    });

  return () => {
    active = false;
  };
};

export const useRuleIndex = (): RuleIndex | null =>
  useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => null,
  );
