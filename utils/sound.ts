// Create audio instances
const keyboardSound =
  typeof Audio !== "undefined" ? new Audio("/sounds/keyboard.mp3") : null;
const clickSound =
  typeof Audio !== "undefined" ? new Audio("/sounds/click.mp3") : null;

// Set volumes
if (keyboardSound) keyboardSound.volume = 0.3;
if (clickSound) clickSound.volume = 0.5;

export const playKeyboardSound = () => {
  if (!keyboardSound) return;
  try {
    keyboardSound.currentTime = 0;
    keyboardSound.play().catch((error) => {
      console.log("Error playing keyboard sound:", error);
    });
  } catch (error) {
    console.error("Error with keyboard sound:", error);
  }
};

export const playClickSound = () => {
  if (!clickSound) return;
  try {
    clickSound.currentTime = 0;
    clickSound.play().catch((error) => {
      console.log("Error playing click sound:", error);
    });
  } catch (error) {
    console.error("Error with click sound:", error);
  }
};
