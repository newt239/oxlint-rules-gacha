import type { Dictionary } from "#/i18n";
import type { FixStatus, RuleDetail } from "#/lib/rules";

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
  <ul>
    <li>{detail.category}</li>
    <li>{detail.plugin}</li>
    <li>{fixLabel(detail.fix, dictionary)}</li>
    <li>{detail.default ? dictionary.defaultOn : dictionary.defaultOff}</li>
    {detail.typeAware && <li>{dictionary.typeAware}</li>}
  </ul>
);
