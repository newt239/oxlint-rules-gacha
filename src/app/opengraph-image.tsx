import { ImageResponse } from "next/og";

import { OG_ALT, OG_CONTENT_TYPE, OG_IMAGE_OPTIONS, OG_SIZE } from "#/lib/og-image";
import { OgImageBody } from "#/lib/og-image-body";
import { SITE_DESCRIPTION } from "#/lib/site";

export const alt = OG_ALT;

export const contentType = OG_CONTENT_TYPE;

export const size = OG_SIZE;

const OpengraphImage = () =>
  new ImageResponse(<OgImageBody title={SITE_DESCRIPTION} />, OG_IMAGE_OPTIONS);

export default OpengraphImage;
