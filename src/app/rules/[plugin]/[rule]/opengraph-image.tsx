import { ImageResponse } from "next/og";

import { OG_ALT, OG_CONTENT_TYPE, OG_IMAGE_OPTIONS, OG_SIZE } from "#/features/og/og-image";
import { OgRuleBody } from "#/features/og/og-rule-body";
import { OgSiteBody } from "#/features/og/og-site-body";
import { findRuleDetail, ruleParams } from "#/lib/rule-catalog";

export const alt = OG_ALT;

export const contentType = OG_CONTENT_TYPE;

export const size = OG_SIZE;

export const generateStaticParams = ruleParams;

type OpengraphImageProps = {
  params: Promise<{ plugin: string; rule: string }>;
};

const OpengraphImage = async ({ params }: OpengraphImageProps) => {
  const { plugin, rule } = await params;
  const detail = findRuleDetail(plugin, rule);

  return new ImageResponse(
    detail === undefined ? (
      <OgSiteBody />
    ) : (
      <OgRuleBody category={detail.category} name={detail.name} plugin={detail.plugin} />
    ),
    OG_IMAGE_OPTIONS,
  );
};

export default OpengraphImage;
