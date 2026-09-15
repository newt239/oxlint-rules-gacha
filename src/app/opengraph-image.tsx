import { ImageResponse } from "next/og";

import { OG_ALT, OG_CONTENT_TYPE, OG_IMAGE_OPTIONS, OG_SIZE } from "#/lib/og-image";
import { OgSiteBody } from "#/lib/og-site-body";

export const alt = OG_ALT;

export const contentType = OG_CONTENT_TYPE;

export const size = OG_SIZE;

const OpengraphImage = () => new ImageResponse(<OgSiteBody />, OG_IMAGE_OPTIONS);

export default OpengraphImage;
