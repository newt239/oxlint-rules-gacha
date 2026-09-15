type StringLiteral = {
  value: boolean | number | string | null;
};

type RuleContext = {
  report: (descriptor: { message: string; node: StringLiteral }) => void;
};

const REM_PATTERN = /(?<length>\d*\.\d+|\d+)rem/g;

export const offScaleRems = (value: string): string[] =>
  [...value.matchAll(REM_PATTERN)]
    .map((match) => match.groups?.length ?? "")
    .filter((length) => !Number.isInteger(Number(length) * 4));

const rule = {
  create: (context: RuleContext) => ({
    Literal: (node: StringLiteral) => {
      if (typeof node.value !== "string") {
        return;
      }

      for (const length of offScaleRems(node.value)) {
        context.report({
          message: `rem は 0.25 刻みで指定してください: ${length}rem`,
          node,
        });
      }
    },
  }),
};

const plugin = {
  meta: { name: "stylex" },
  rules: { "rem-scale": rule },
};

export default plugin;
