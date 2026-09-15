import * as stylex from "@stylexjs/stylex";

import { color, font, layout } from "#/styles/tokens.stylex";

import type { CodeExample } from "#/lib/rules";

const styles = stylex.create({
  code: {
    fontFamily: font.mono,
    fontSize: "0.8125rem",
    lineHeight: 1.7,
  },
  pre: {
    backgroundColor: color.cabinet2,
    borderRadius: layout.radius,
    color: color.ink,
    margin: 0,
    overflowX: "auto",
    padding: "1rem",
  },
});

type CodeBlockProps = {
  example: CodeExample;
};

export const CodeBlock = ({ example }: CodeBlockProps) => (
  <pre {...stylex.props(styles.pre)}>
    <code {...stylex.props(styles.code)}>{example.code}</code>
  </pre>
);
