import { SITE_URL } from "#/lib/site";

import { CABINET, CATEGORY_COLORS, ON_TINT } from "./og-colors";

import type { Category } from "#/lib/rules";

const SHORT_NAME_LENGTH = 18;

const CTA = "Tap to add this rule to your collection.";

type OgRuleBodyProps = {
  category: Category;
  name: string;
  plugin: string;
};

export const OgRuleBody = ({ category, name, plugin }: OgRuleBodyProps) => (
  <div
    style={{
      backgroundColor: CATEGORY_COLORS[category],
      color: CABINET,
      display: "flex",
      flexDirection: "column",
      fontFamily: "Baloo 2",
      height: "100%",
      justifyContent: "center",
      padding: "60px 70px",
      position: "relative",
      width: "100%",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ color: ON_TINT, fontSize: 32, fontWeight: 700, letterSpacing: 2 }}>
        {plugin}
      </div>
      <div
        style={{
          fontSize: name.length <= SHORT_NAME_LENGTH ? 104 : 72,
          fontWeight: 700,
          letterSpacing: -2,
          lineHeight: 1,
          marginTop: 16,
        }}
      >
        {name}
      </div>
      <div style={{ color: ON_TINT, fontSize: 34, marginTop: 22 }}>{CTA}</div>
    </div>
    <div
      style={{
        bottom: 60,
        color: ON_TINT,
        fontSize: 28,
        letterSpacing: 1,
        position: "absolute",
        right: 70,
      }}
    >
      {SITE_URL.host}
    </div>
  </div>
);
