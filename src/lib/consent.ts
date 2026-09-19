export type ConsentChoice = "denied" | "granted";

export type ConsentState = ConsentChoice | "unset";

export const CONSENT_STORAGE_KEY = "oxlint-gacha:consent";

export const DEFAULT_CONSENT: ConsentState = "unset";

export const reviveConsent = (value: unknown): ConsentState | null =>
  value === "denied" || value === "granted" || value === "unset" ? value : null;
