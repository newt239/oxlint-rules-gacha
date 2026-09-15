import type { Route } from "next";

export type RuleHref = Route<`/rules/${string}/${string}`>;

export const ruleHref = (plugin: string, name: string): RuleHref => `/rules/${plugin}/${name}`;
