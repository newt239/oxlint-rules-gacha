import { trackEvent } from "#/lib/analytics";
import { type Collection, hasObtained, obtainedIds, recordDraw } from "#/lib/collection";
import { applyFilter, draw, type Filter } from "#/lib/draw";
import { loadRuleIndex, type RuleIndexEntry } from "#/lib/rules";
import { collectionStore } from "#/lib/stores";

export type DrawTrigger = "auto" | "manual";

export const drawAndRecord = async (
  collection: Collection,
  filter: Filter,
  trigger: DrawTrigger,
): Promise<RuleIndexEntry | null> => {
  const { rules, rulesetVersion } = await loadRuleIndex();
  const picked = draw(applyFilter(rules, filter), new Set(obtainedIds(collection)), Math.random);

  if (picked === null) {
    trackEvent("gacha_draw_empty", {
      excluded_categories: filter.excludedCategories.join(","),
      excluded_plugins: filter.excludedPlugins.join(","),
    });

    return null;
  }

  trackEvent("gacha_draw", {
    draw_trigger: trigger,
    is_new: !hasObtained(collection, picked.id),
    rule_category: picked.category,
    rule_id: picked.id,
    rule_plugin: picked.plugin,
  });

  collectionStore.set(recordDraw(collection, picked.id, { now: Date.now(), rulesetVersion }));

  return picked;
};
