import type { CodeExample } from "#/lib/rules";

type CodeBlockProps = {
  example: CodeExample;
};

export const CodeBlock = ({ example }: CodeBlockProps) => (
  <pre>
    <code>{example.code}</code>
  </pre>
);
