import { z } from "zod";

const CATEGORIES = [
  "correctness",
  "nursery",
  "pedantic",
  "perf",
  "restriction",
  "style",
  "suspicious",
] as const;

const FIX_STATUSES = ["dangerous", "fix", "none", "suggestion"] as const;

const rawFixSchema = z.enum([
  "conditional_dangerous_fix",
  "conditional_dangerous_fix_or_suggestion",
  "conditional_fix",
  "conditional_safe_fix_or_suggestion",
  "conditional_suggestion",
  "fixable_dangerous_fix",
  "fixable_dangerous_fix_or_suggestion",
  "fixable_dangerous_suggestion",
  "fixable_fix",
  "fixable_safe_fix_or_suggestion",
  "fixable_suggestion",
  "none",
  "pending",
]);

export const rawRuleMetadataSchema = z.object({
  category: z.enum(CATEGORIES),
  default: z.boolean(),
  docs_url: z.url(),
  fix: rawFixSchema,
  scope: z.string().min(1),
  type_aware: z.boolean(),
  value: z.string().min(1),
  version: z.string().min(1),
});

const codeExampleSchema = z.object({
  code: z.string().min(1),
  lang: z.string(),
});

export const ruleDetailSchema = z.object({
  category: z.enum(CATEGORIES),
  correct: z.array(codeExampleSchema),
  default: z.boolean(),
  description: z.string().min(1),
  docsUrl: z.url(),
  fix: z.enum(FIX_STATUSES),
  id: z.string().min(1),
  incorrect: z.array(codeExampleSchema),
  name: z.string().min(1),
  plugin: z.string().min(1),
  summary: z.string(),
  typeAware: z.boolean(),
  version: z.string().min(1),
});

export type RawRuleMetadata = z.infer<typeof rawRuleMetadataSchema>;
export type CodeExample = z.infer<typeof codeExampleSchema>;
export type RuleDetail = z.infer<typeof ruleDetailSchema>;
export type FixStatus = (typeof FIX_STATUSES)[number];

const RAW_FIX_TO_STATUS: Record<RawRuleMetadata["fix"], FixStatus> = {
  conditional_dangerous_fix: "dangerous",
  conditional_dangerous_fix_or_suggestion: "dangerous",
  conditional_fix: "fix",
  conditional_safe_fix_or_suggestion: "fix",
  conditional_suggestion: "suggestion",
  fixable_dangerous_fix: "dangerous",
  fixable_dangerous_fix_or_suggestion: "dangerous",
  fixable_dangerous_suggestion: "dangerous",
  fixable_fix: "fix",
  fixable_safe_fix_or_suggestion: "fix",
  fixable_suggestion: "suggestion",
  none: "none",
  pending: "none",
};

export const toFixStatus = (rawFix: RawRuleMetadata["fix"]): FixStatus => RAW_FIX_TO_STATUS[rawFix];
