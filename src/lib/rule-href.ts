export type RuleHref = `/${string}/rules/${string}/${string}`;

export const ruleHref = (lang: string, plugin: string, name: string): RuleHref =>
  `/${lang}/rules/${plugin}/${name}`;
