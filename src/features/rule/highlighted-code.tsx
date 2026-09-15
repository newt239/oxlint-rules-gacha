import * as stylex from "@stylexjs/stylex";

import { codeBlockStyles } from "#/components/code-block-styles";

import { loadHighlighter, THEME, toHighlightLang } from "./highlighter";

import type { CodeExample } from "#/lib/rules";

const styles = stylex.create({
  token: (value: string) => ({ color: value }),
});

type HighlightedCodeProps = {
  example: CodeExample;
};

export const HighlightedCode = async ({ example }: HighlightedCodeProps) => {
  const highlighter = await loadHighlighter();
  const { tokens } = highlighter.codeToTokens(example.code, {
    lang: toHighlightLang(example.lang),
    theme: THEME,
  });
  const nodes: React.ReactNode[] = [];

  for (const [lineIndex, line] of tokens.entries()) {
    for (const token of line) {
      nodes.push(
        <span key={token.offset} {...stylex.props(styles.token(token.color ?? ""))}>
          {token.content}
        </span>,
      );
    }

    if (lineIndex < tokens.length - 1) {
      nodes.push("\n");
    }
  }

  return (
    <pre {...stylex.props(codeBlockStyles.pre)}>
      <code {...stylex.props(codeBlockStyles.code)}>{nodes}</code>
    </pre>
  );
};
