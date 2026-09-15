"use client";

import type { useAnimate } from "motion/react";

type Animate = ReturnType<typeof useAnimate>[1];

const CABINET = "[data-cabinet]";
const CAPSULE = "[data-capsule]";

const REDUCED_CROSSFADE_SECONDS = 0.15;
const REDUCED_TIMEOUT_MS = 600;
const SEQUENCE_TIMEOUT_MS = 2600;

const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const runSequence = async (
  animate: Animate,
  reducedMotion: boolean,
  isSkipped: () => boolean,
): Promise<void> => {
  if (reducedMotion) {
    await animate(CAPSULE, { opacity: [0, 1] }, { duration: REDUCED_CROSSFADE_SECONDS });

    return;
  }

  await animate(CABINET, { scale: [1, 0.97, 1] }, { duration: 0.12 });

  if (isSkipped()) {
    return;
  }

  await animate(
    CAPSULE,
    { opacity: [0, 1], y: [-180, 0] },
    { bounce: 0.5, duration: 0.6, type: "spring" },
  );

  if (isSkipped()) {
    return;
  }

  await animate(CAPSULE, { x: [0, -5, 5, -4, 4, 0] }, { duration: 0.3 });

  if (isSkipped()) {
    return;
  }

  await animate(CAPSULE, { opacity: [1, 1, 0], scale: [1, 1.18, 0.2] }, { duration: 0.4 });

  if (isSkipped()) {
    return;
  }

  await wait(200);
};

export const playSequence = async (
  animate: Animate,
  reducedMotion: boolean,
  isSkipped: () => boolean,
): Promise<void> => {
  await Promise.race([
    runSequence(animate, reducedMotion, isSkipped),
    wait(reducedMotion ? REDUCED_TIMEOUT_MS : SEQUENCE_TIMEOUT_MS),
  ]);
};
