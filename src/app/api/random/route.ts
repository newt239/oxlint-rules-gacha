import { findRuleDetail, RULE_IDS } from "#/lib/rule-catalog";
import { ruleHref } from "#/lib/rules";
import { SITE_URL } from "#/lib/site";

const CORS_HEADERS = { "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" };

export const GET = () => {
  const id = RULE_IDS[Math.floor(Math.random() * RULE_IDS.length)] ?? "";
  const [plugin = "", name = ""] = id.split("/");
  const detail = findRuleDetail(plugin, name);

  if (detail === undefined) {
    return Response.json({ error: "No rule available." }, { headers: CORS_HEADERS, status: 503 });
  }

  return Response.json(
    {
      category: detail.category,
      correct: detail.correct,
      docsUrl: detail.docsUrl,
      enabledByDefault: detail.default,
      fix: detail.fix,
      id: detail.id,
      incorrect: detail.incorrect,
      name: detail.name,
      plugin: detail.plugin,
      summary: detail.summary,
      typeAware: detail.typeAware,
      url: new URL(ruleHref(plugin, name), SITE_URL).toString(),
      version: detail.version,
    },
    { headers: CORS_HEADERS },
  );
};
