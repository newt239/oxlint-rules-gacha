import { ImageResponse } from "next/og";

import { findRuleDetail, RULE_IDS } from "#/lib/rule-catalog";
import { SITE_NAME } from "#/lib/site";

export const alt = SITE_NAME;

export const generateStaticParams = () =>
  RULE_IDS.map((id) => {
    const [plugin = "", rule = ""] = id.split("/");

    return { plugin, rule };
  });

export const contentType = "image/png";
export const size = { height: 630, width: 1200 };

type OpengraphImageProps = {
  params: Promise<{ lang: string; plugin: string; rule: string }>;
};

const OpengraphImage = async ({ params }: OpengraphImageProps) => {
  const { plugin, rule } = await params;
  const detail = findRuleDetail(plugin, rule);

  return new ImageResponse(
    <div
      style={{
        background: "#14131F",
        color: "#FFF6E8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: 80,
        width: "100%",
      }}
    >
      <div style={{ color: "#A8A2C4", fontSize: 32 }}>{SITE_NAME}</div>
      <div style={{ fontSize: 72, marginTop: 24 }}>{detail?.id ?? SITE_NAME}</div>
      <div style={{ color: "#FFC53D", fontSize: 36, marginTop: 24 }}>{detail?.category ?? ""}</div>
    </div>,
    size,
  );
};

export default OpengraphImage;
