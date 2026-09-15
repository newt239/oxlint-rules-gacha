import { burstConfetti } from "./confetti";
import { categoryColor, inkColor } from "./palette";

import type { RuleIndexEntry } from "#/lib/rules";

import type { useAnimate } from "motion/react";

type Animate = ReturnType<typeof useAnimate>[1];

type Controls = {
  stop: () => void;
  then: (onResolve: VoidFunction) => Promise<void>;
};

export type Phase = "idle" | "lever" | "drop" | "rattle" | "open" | "reveal";

const CABINET = "[data-cabinet]";
const FLASH = "[data-flash]";
const REVEAL = "[data-reveal]";

export const CAPSULE = "[data-capsule]";
export const SPEED_LINES = "[data-speed-lines]";

const REDUCED_CROSSFADE_SECONDS = 0.15;
const REDUCED_TIMEOUT_MS = 600;
const REVEAL_HOLD_MS = 2000;
const SEQUENCE_TIMEOUT_MS = 7000;

type PlaySequenceOptions = {
  animate: Animate;
  picked: Promise<RuleIndexEntry | null>;
  reducedMotion: boolean;
  setPhase: (phase: Phase) => void;
  setPicked: (entry: RuleIndexEntry) => void;
  skipped: Promise<boolean>;
};

const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const race = async (controls: Controls, skipped: Promise<boolean>): Promise<boolean> => {
  const finished = new Promise<boolean>((resolve) => {
    controls
      .then(() => {
        resolve(false);
      })
      .catch(() => {
        resolve(false);
      });
  });
  const skippedFirst = await Promise.race([finished, skipped]);

  if (skippedFirst) {
    controls.stop();
  }

  return skippedFirst;
};

const runSequence = async ({
  animate,
  picked,
  reducedMotion,
  setPhase,
  setPicked,
  skipped,
}: PlaySequenceOptions): Promise<RuleIndexEntry | null> => {
  if (reducedMotion) {
    setPhase("drop");
    await animate(CAPSULE, { opacity: [0, 1] }, { duration: REDUCED_CROSSFADE_SECONDS });

    return picked;
  }

  setPhase("lever");

  if (
    await race(
      animate([
        [CABINET, { rotate: [0, -1.5, 1.5, 0], scale: [1, 0.965, 1] }, { duration: 0.28 }],
        [CAPSULE, { opacity: [1, 0], scale: [1, 0.5] }, { at: 0, duration: 0.28 }],
      ]),
      skipped,
    )
  ) {
    return picked;
  }

  setPhase("drop");
  animate(SPEED_LINES, { opacity: [0, 0.28], scale: [0.65, 1] }, { duration: 0.2 });

  if (
    await race(
      animate(
        CAPSULE,
        { opacity: [0, 1], scale: [0.5, 1], y: [-210, 0] },
        { bounce: 0.55, duration: 0.7, type: "spring" },
      ),
      skipped,
    )
  ) {
    return picked;
  }

  setPhase("rattle");

  if (
    await race(
      animate(
        CAPSULE,
        {
          filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"],
          rotate: [0, -3, 4, -6, 7, -9, 10, 0],
          x: [0, -3, 4, -6, 7, -9, 10, 0],
        },
        { duration: 0.5 },
      ),
      skipped,
    )
  ) {
    return picked;
  }

  const entry = await picked;

  if (entry === null) {
    return null;
  }

  setPicked(entry);
  setPhase("open");

  burstConfetti([categoryColor(entry.category), inkColor(), categoryColor("perf")]).catch(
    (error: unknown) => {
      console.error(error);
    },
  );

  if (
    await race(
      animate([
        [FLASH, { opacity: [0, 0.85, 0] }, { duration: 0.32 }],
        [CAPSULE, { filter: "brightness(1.6)", scale: 1.12 }, { at: 0, duration: 0.32 }],
      ]),
      skipped,
    )
  ) {
    return entry;
  }

  setPhase("reveal");

  if (
    await race(
      animate(
        REVEAL,
        { opacity: [0, 1], scale: [0.82, 1], y: [28, 0] },
        { bounce: 0.4, duration: 0.5, type: "spring" },
      ),
      skipped,
    )
  ) {
    return entry;
  }

  await Promise.race([wait(REVEAL_HOLD_MS), skipped]);

  return entry;
};

export const playSequence = async (
  options: PlaySequenceOptions,
): Promise<RuleIndexEntry | null> => {
  const timeout = options.reducedMotion ? REDUCED_TIMEOUT_MS : SEQUENCE_TIMEOUT_MS;
  const timedOut = async (): Promise<RuleIndexEntry | null> => {
    await wait(timeout);

    return options.picked;
  };
  const entry = await Promise.race([runSequence(options), timedOut()]);

  return entry;
};
