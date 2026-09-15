import { color } from "#/styles/tokens.stylex";

import type { Category } from "#/lib/rules";

const CATEGORY_TOKENS: Record<Category, string> = {
  correctness: color.catCorrectness,
  nursery: color.catNursery,
  pedantic: color.catPedantic,
  perf: color.catPerf,
  restriction: color.catRestriction,
  style: color.catStyle,
  suspicious: color.catSuspicious,
};

const CUSTOM_PROPERTY = /^var\((?<name>--[\w-]+)\)$/u;

const resolve = (token: string): string => {
  const name = CUSTOM_PROPERTY.exec(token)?.groups?.name;

  if (name === undefined) {
    return token;
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  return value === "" ? token : value;
};

export const categoryColor = (category: Category): string => resolve(CATEGORY_TOKENS[category]);

export const inkColor = (): string => resolve(color.ink);

export const cabinetColor = (): string => resolve(color.cabinet2);
