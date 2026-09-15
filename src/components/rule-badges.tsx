import * as stylex from "@stylexjs/stylex";

import { CategoryBadge } from "#/components/category-badge";
import { color, font, layout } from "#/styles/tokens.stylex";

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
};

const fixLabel = (fix: FixStatus): string => {
  if (fix === "fix") {
    return "auto-fix";
  }

  if (fix === "suggestion") {
    return "suggestion";
  }

  if (fix === "dangerous") {
    return "dangerous fix";
  }

  return "no fix";
};

export const RuleBadges = ({ detail }: RuleBadgesProps) => (
  <ul {...stylex.props(styles.list)}>
    <li>
      <CategoryBadge category={detail.category} />
    </li>
    <li {...stylex.props(styles.meta)}>{detail.plugin}</li>
    <li {...stylex.props(styles.meta)}>{fixLabel(detail.fix)}</li>
    <li {...stylex.props(styles.meta)}>{detail.default ? "on by default" : "off by default"}</li>
    {detail.typeAware && <li {...stylex.props(styles.meta)}>needs type information</li>}
  </ul>
);
