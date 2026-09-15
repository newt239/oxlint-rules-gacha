import * as stylex from "@stylexjs/stylex";

import { CategoryBadge } from "#/components/category-badge";
import { color, font, layout } from "#/styles/tokens.stylex";

import type { Dictionary } from "#/i18n";
import type { FixStatus, RuleDetail } from "#/lib/rules";

const styles = stylex.create({
  list: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  meta: {
    borderColor: color.inkDim,
    borderRadius: layout.radius,
    borderStyle: "solid",
    borderWidth: "1px",
    color: color.inkDim,
    fontFamily: font.mono,
    fontSize: "0.75rem",
    lineHeight: 1.8,
    paddingInline: "0.7em",
  },
});

type RuleBadgesProps = {
  detail: RuleDetail;
  dictionary: Dictionary;
};

const fixLabel = (fix: FixStatus, dictionary: Dictionary): string => {
  if (fix === "fix") {
    return dictionary.fixFix;
  }

  if (fix === "suggestion") {
    return dictionary.fixSuggestion;
  }

  if (fix === "dangerous") {
    return dictionary.fixDangerous;
  }

  return dictionary.fixNone;
};

export const RuleBadges = ({ detail, dictionary }: RuleBadgesProps) => (
  <ul {...stylex.props(styles.list)}>
    <li>
      <CategoryBadge category={detail.category} />
    </li>
    <li {...stylex.props(styles.meta)}>{detail.plugin}</li>
    <li {...stylex.props(styles.meta)}>{fixLabel(detail.fix, dictionary)}</li>
    <li {...stylex.props(styles.meta)}>
      {detail.default ? dictionary.defaultOn : dictionary.defaultOff}
    </li>
    {detail.typeAware && <li {...stylex.props(styles.meta)}>{dictionary.typeAware}</li>}
  </ul>
);
