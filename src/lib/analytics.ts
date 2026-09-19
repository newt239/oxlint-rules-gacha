import { sendGAEvent } from "@next/third-parties/google";

import { CONSENT_STORAGE_KEY, type ConsentChoice } from "./consent";

const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

const GRANTED: ConsentChoice = "granted";

type EventParams = Record<string, boolean | number | string>;

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const GA_LOCAL_DISABLE_SCRIPT = `if(${JSON.stringify(LOCAL_HOSTNAMES)}.includes(location.hostname))window["ga-disable-${GA_MEASUREMENT_ID}"]=true;`;

export const GA_CONSENT_BOOTSTRAP_SCRIPT = [
  "window.dataLayer=window.dataLayer||[];",
  "function gtag(){dataLayer.push(arguments)}",
  "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});",
  `try{const c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});`,
  `if(c!==null&&JSON.parse(c)===${JSON.stringify(GRANTED)})`,
  "gtag('consent','update',{analytics_storage:'granted'})}catch{}",
].join("");

export const trackEvent = (name: string, params: EventParams): void => {
  if (GA_MEASUREMENT_ID === "") {
    return;
  }

  sendGAEvent("event", name, params);
};

export const updateAnalyticsConsent = (choice: ConsentChoice): void => {
  if (GA_MEASUREMENT_ID === "") {
    return;
  }

  sendGAEvent("consent", "update", { analytics_storage: choice });
};
