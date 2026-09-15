import * as stylex from "@stylexjs/stylex";

import { codeBlockStyles } from "./code-block-styles";

import type { CodeExample } from "#/lib/rules";

type CodeBlockProps = {
  example: CodeExample;
};

export const CodeBlock = ({ example }: CodeBlockProps) => (
  <pre {...stylex.props(codeBlockStyles.pre)}>
    <code {...stylex.props(codeBlockStyles.code)}>{example.code}</code>
  </pre>
);
