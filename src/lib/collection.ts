type ObtainedEntry = {
  count: number;
  firstAt: number;
};

export type Collection = {
  obtained: Record<string, ObtainedEntry>;
  rulesetVersion: string;
  version: 1;
};

export const EMPTY_COLLECTION: Collection = { obtained: {}, rulesetVersion: "", version: 1 };

const toObtainedEntry = (value: unknown): ObtainedEntry | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const count = "count" in value ? value.count : null;
  const firstAt = "firstAt" in value ? value.firstAt : null;

  if (typeof count !== "number" || typeof firstAt !== "number") {
    return null;
  }

  return { count, firstAt };
};

const fromRuleIds = (value: readonly unknown[]): Collection => {
  const obtained: Record<string, ObtainedEntry> = {};

  for (const id of value) {
    if (typeof id === "string") {
      obtained[id] = { count: 1, firstAt: 0 };
    }
  }

  return { obtained, rulesetVersion: "", version: 1 };
};

export const reviveCollection = (value: unknown): Collection | null => {
  if (Array.isArray(value)) {
    const ids: unknown[] = value;

    return fromRuleIds(ids);
  }

  if (typeof value !== "object" || value === null) {
    return null;
  }

  const rawObtained = "obtained" in value ? value.obtained : null;
  const rawVersion = "rulesetVersion" in value ? value.rulesetVersion : null;

  if (typeof rawObtained !== "object" || rawObtained === null) {
    return null;
  }

  const entries: [string, unknown][] = Object.entries(rawObtained);
  const obtained: Record<string, ObtainedEntry> = {};

  for (const [id, entry] of entries) {
    const revived = toObtainedEntry(entry);

    if (revived !== null) {
      obtained[id] = revived;
    }
  }

  return { obtained, rulesetVersion: typeof rawVersion === "string" ? rawVersion : "", version: 1 };
};

export const obtainedIds = (collection: Collection): string[] => Object.keys(collection.obtained);

export type DrawContext = {
  now: number;
  rulesetVersion: string;
};

export const recordDraw = (
  collection: Collection,
  ruleId: string,
  context: DrawContext,
): Collection => {
  const previous = Object.hasOwn(collection.obtained, ruleId)
    ? collection.obtained[ruleId]
    : { count: 0, firstAt: context.now };

  return {
    obtained: {
      ...collection.obtained,
      [ruleId]: { count: previous.count + 1, firstAt: previous.firstAt },
    },
    rulesetVersion: context.rulesetVersion,
    version: 1,
  };
};
