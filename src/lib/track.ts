"use client";

import { sendGAEvent } from "@next/third-parties/google";

import { GA_MEASUREMENT_ID } from "./analytics";

type EventParams = Record<string, boolean | number | string>;

export const trackEvent = (name: string, params: EventParams): void => {
  if (GA_MEASUREMENT_ID === "") {
    return;
  }

  sendGAEvent("event", name, params);
};
