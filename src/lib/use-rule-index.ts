"use client";

import { useSyncExternalStore } from "react";

import { loadRuleIndex } from "./rule-index-cache";

import type { RuleIndex } from "./rules";

const listeners = new Set<() => void>();

let snapshot: RuleIndex | null = null;
let started = false;

const start = () => {
  if (started) {
    return;
  }

  started = true;
  loadRuleIndex()
    .then((index) => {
      snapshot = index;

      for (const listener of listeners) {
        listener();
      }
    })
    .catch((error: unknown) => {
      console.error(error);
    });
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  start();

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): RuleIndex | null => snapshot;

const getServerSnapshot = (): RuleIndex | null => null;

export const useRuleIndex = (): RuleIndex | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
