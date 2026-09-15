export const burstConfetti = async (colors: string[]): Promise<void> => {
  const { confetti } = await import("@tsparticles/confetti");

  await confetti({
    colors,
    disableForReducedMotion: true,
    origin: { x: 0.5, y: 0.45 },
    particleCount: 90,
    scalar: 0.9,
    spread: 110,
    startVelocity: 38,
    ticks: 160,
  });
  await confetti({
    colors,
    disableForReducedMotion: true,
    origin: { x: 0.5, y: 0.5 },
    particleCount: 45,
    scalar: 1.3,
    spread: 70,
    startVelocity: 26,
    ticks: 200,
  });
};
