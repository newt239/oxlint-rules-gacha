import * as stylex from "@stylexjs/stylex";

import { codeBlockStyles } from "#/components/code-block-styles";

type CodeBlockProps = {
  code: string;
};

export const CodeBlock = ({ code }: CodeBlockProps) => (
  <pre {...stylex.props(codeBlockStyles.pre)}>
    <code {...stylex.props(codeBlockStyles.code)}>{code}</code>
  </pre>
);
