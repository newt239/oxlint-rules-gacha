import type { CodeExample } from "./rule-schema.mts";

const FRONTMATTER_PATTERN = /^---\r?\n[\s\S]*?\r?\n---\r?\n/u;
const SECOND_LEVEL_HEADING_PATTERN = /^## /mu;
const BOILERPLATE_HEADING_PATTERN = /^## (?:How to use|Version|References)/mu;
const WHAT_IT_DOES_HEADING = "### What it does";
const EXAMPLE_MARKER_PATTERN =
  /^#{0,4} ?Examples? of (?:\*\*)?(?<kind>incorrect|invalid|correct|valid)(?:\*\*)?[^\n]*$/gmu;
const FENCE_PATTERN = /^```(?<lang>[\w-]*)\r?\n(?<code>[\s\S]*?)\r?\n```$/gmu;

export type RuleDoc = {
  correct: CodeExample[];
  description: string;
  incorrect: CodeExample[];
  summary: string;
};

const sliceBefore = (source: string, pattern: RegExp): string => {
  const end = pattern.exec(source)?.index;

  return (end === undefined ? source : source.slice(0, end)).trim();
};

const extractDescription = (content: string): string => {
  const start = content.indexOf(WHAT_IT_DOES_HEADING);

  return sliceBefore(start === -1 ? content : content.slice(start), SECOND_LEVEL_HEADING_PATTERN);
};

const INLINE_LINK_PATTERN = /\[(?<text>[^\]]+)\]\([^)]*\)/gu;
const INLINE_CODE_PATTERN = /`(?<code>[^`]+)`/gu;
const INLINE_EMPHASIS_PATTERN = /\*{1,2}(?<text>[^*]+)\*{1,2}/gu;

const toPlainText = (markdown: string): string =>
  markdown
    .replaceAll(INLINE_LINK_PATTERN, "$<text>")
    .replaceAll(INLINE_CODE_PATTERN, "$<code>")
    .replaceAll(INLINE_EMPHASIS_PATTERN, "$<text>");

const extractSummary = (description: string): string => {
  if (!description.startsWith(WHAT_IT_DOES_HEADING)) {
    return "";
  }

  const [firstParagraph = ""] = description
    .slice(WHAT_IT_DOES_HEADING.length)
    .trimStart()
    .split(/\r?\n\r?\n/u);

  return toPlainText(firstParagraph.replaceAll(/\r?\n/gu, " ")).trim();
};

const extractFences = (segment: string): CodeExample[] =>
  [...segment.matchAll(FENCE_PATTERN)].map((match) => ({
    code: match.groups?.code ?? "",
    lang: match.groups?.lang ?? "",
  }));

export const parseRuleDoc = (markdown: string): RuleDoc => {
  const content = markdown.replace(FRONTMATTER_PATTERN, "");
  const description = extractDescription(content);
  const examplesSource = sliceBefore(content, BOILERPLATE_HEADING_PATTERN);
  const markers = [...examplesSource.matchAll(EXAMPLE_MARKER_PATTERN)];
  const correct: CodeExample[] = [];
  const incorrect: CodeExample[] = [];

  for (const [index, marker] of markers.entries()) {
    const start = marker.index + marker[0].length;
    const end = markers[index + 1]?.index ?? examplesSource.length;
    const fences = extractFences(examplesSource.slice(start, end));
    const isCorrect = marker.groups?.kind === "correct" || marker.groups?.kind === "valid";

    (isCorrect ? correct : incorrect).push(...fences);
  }

  return { correct, description, incorrect, summary: extractSummary(description) };
};
