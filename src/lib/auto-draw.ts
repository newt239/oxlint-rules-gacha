const AUTO_DRAW_KEY = "oxlint-gacha:auto-draw";

export const requestAutoDraw = (): void => {
  try {
    sessionStorage.setItem(AUTO_DRAW_KEY, "1");
  } catch (error) {
    console.error(error);
  }
};

export const consumeAutoDraw = (): boolean => {
  try {
    const requested = sessionStorage.getItem(AUTO_DRAW_KEY) !== null;

    sessionStorage.removeItem(AUTO_DRAW_KEY);

    return requested;
  } catch (error) {
    console.error(error);

    return false;
  }
};
