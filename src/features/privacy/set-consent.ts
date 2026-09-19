import { updateAnalyticsConsent } from "#/lib/analytics";
import { consentStore } from "#/lib/stores";

import type { ConsentChoice } from "#/lib/consent";

const GA_COOKIE_PREFIX = "_ga";

const EXPIRED = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

export const cookieDomainCandidates = (hostname: string): string[] => {
  const labels = hostname.split(".");
  const candidates: string[] = [];

  for (let index = 0; index < labels.length - 1; index++) {
    candidates.push(labels.slice(index).join("."));
  }

  return candidates;
};

const expireCookie = (name: string, domain: string | null): void => {
  // oxlint-disable-next-line unicorn/no-document-cookie -- Cookie Store API は Safari 未対応
  document.cookie =
    domain === null ? `${name}=; ${EXPIRED}` : `${name}=; ${EXPIRED}; domain=${domain}`;
};

const clearGaCookies = (): void => {
  const names = document.cookie
    .split(";")
    .map((entry) => entry.trim().split("=")[0])
    .filter((name) => name.startsWith(GA_COOKIE_PREFIX));
  const domains = cookieDomainCandidates(location.hostname);

  for (const name of names) {
    expireCookie(name, null);

    for (const domain of domains) {
      expireCookie(name, domain);
      expireCookie(name, `.${domain}`);
    }
  }
};

export const setConsent = (choice: ConsentChoice): void => {
  consentStore.set(choice);
  updateAnalyticsConsent(choice);

  if (choice === "denied") {
    clearGaCookies();
  }
};
