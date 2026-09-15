import { ImageResponse } from "next/og";

import { findRuleDetail, RULE_IDS } from "#/lib/rule-catalog";
import { SITE_NAME } from "#/lib/site";

import type { Category } from "#/lib/rules";

export const alt = SITE_NAME;

export const contentType = "image/png";

export const size = { height: 630, width: 1200 };

export const generateStaticParams = () =>
  RULE_IDS.map((id) => {
    const [plugin = "", rule = ""] = id.split("/");

    return { plugin, rule };
  });

const CABINET = "#14131F";
const INK = "#FFF6E8";
const INK_DIM = "#A8A2C4";

const CATEGORY_COLORS: Record<Category, string> = {
  correctness: "#FF4D5E",
  nursery: "#7A8CA8",
  pedantic: "#9B6DFF",
  perf: "#4ADE80",
  restriction: "#F5C14E",
  style: "#35D0D6",
  suspicious: "#FFC53D",
};

type OpengraphImageProps = {
  params: Promise<{ plugin: string; rule: string }>;
};

const OpengraphImage = async ({ params }: OpengraphImageProps) => {
  const { plugin, rule } = await params;
  const detail = findRuleDetail(plugin, rule);

  return new ImageResponse(
    <div
      style={{
        background: CABINET,
        color: INK,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: 88,
        width: "100%",
      }}
    >
      <div style={{ color: INK_DIM, fontSize: 30, letterSpacing: 4 }}>
        {SITE_NAME.toUpperCase()}
      </div>
      <div style={{ fontSize: 80, lineHeight: 1.2, marginTop: 28 }}>{detail?.id ?? SITE_NAME}</div>
      {detail !== undefined && (
        <div style={{ display: "flex", marginTop: 36 }}>
          <div
            style={{
              background: CATEGORY_COLORS[detail.category],
              borderRadius: 999,
              color: CABINET,
              fontSize: 32,
              padding: "8px 28px",
            }}
          >
            {detail.category}
          </div>
        </div>
      )}
    </div>,
    size,
  );
};

export default OpengraphImage;
