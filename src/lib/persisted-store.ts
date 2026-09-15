export type PersistedStore<T> = {
  getServerSnapshot: () => T;
  getSnapshot: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
};

export const createPersistedStore = <T>(
  key: string,
  fallback: T,
  revive: (value: unknown) => T | null,
): PersistedStore<T> => {
  const listeners = new Set<() => void>();
  let snapshot = fallback;
  let loaded = false;

  const load = (): T => {
    if (loaded) {
      return snapshot;
    }

    loaded = true;

    try {
      const raw = localStorage.getItem(key);
      const revived = raw === null ? null : revive(JSON.parse(raw));

      if (revived !== null) {
        snapshot = revived;
      }
    } catch {
      snapshot = fallback;
    }

    return snapshot;
  };

  return {
    getServerSnapshot: () => fallback,
    getSnapshot: load,
    set: (value) => {
      loaded = true;
      snapshot = value;

      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }

      for (const listener of listeners) {
        listener();
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
  };
};
