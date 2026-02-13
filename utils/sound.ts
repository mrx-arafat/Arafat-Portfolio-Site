// Lazy-loaded audio instances - only created when first played
let keyboardSound: HTMLAudioElement | null = null;
let clickSound: HTMLAudioElement | null = null;

function getKeyboardSound() {
  if (!keyboardSound && typeof Audio !== "undefined") {
    keyboardSound = new Audio("/sounds/keyboard.mp3");
    keyboardSound.volume = 0.3;
  }
  return keyboardSound;
}

function getClickSound() {
  if (!clickSound && typeof Audio !== "undefined") {
    clickSound = new Audio("/sounds/click.mp3");
    clickSound.volume = 0.5;
  }
  return clickSound;
}

export const playKeyboardSound = () => {
  const sound = getKeyboardSound();
  if (!sound) return;
  try {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  } catch {}
};

export const playClickSound = () => {
  const sound = getClickSound();
  if (!sound) return;
  try {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  } catch {}
};
