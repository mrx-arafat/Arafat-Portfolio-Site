// Lazy-loaded audio instances - only created when first played
let keyboardSound: HTMLAudioElement | null = null;
let clickSound: HTMLAudioElement | null = null;
let backgroundMusic: HTMLAudioElement | null = null;

const MUSIC_MUTED_KEY = "music-muted";

function getBackgroundMusic() {
  if (!backgroundMusic && typeof Audio !== "undefined") {
    backgroundMusic = new Audio("/sounds/ambient.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.15;
  }
  return backgroundMusic;
}

export const playBackgroundMusic = () => {
  const music = getBackgroundMusic();
  if (!music) return;
  try {
    music.play().catch(() => {});
  } catch {}
};

export const pauseBackgroundMusic = () => {
  const music = getBackgroundMusic();
  if (!music) return;
  try {
    music.pause();
  } catch {}
};

export const toggleBackgroundMusic = (): boolean => {
  const music = getBackgroundMusic();
  if (!music) return true;
  if (music.paused) {
    playBackgroundMusic();
    localStorage.setItem(MUSIC_MUTED_KEY, "false");
    return false;
  } else {
    pauseBackgroundMusic();
    localStorage.setItem(MUSIC_MUTED_KEY, "true");
    return true;
  }
};

export const isBackgroundMusicPlaying = (): boolean => {
  const music = getBackgroundMusic();
  return music ? !music.paused : false;
};

export const setBackgroundMusicVolume = (volume: number) => {
  const music = getBackgroundMusic();
  if (music) {
    music.volume = Math.max(0, Math.min(1, volume));
  }
};

export const getMusicMutedPreference = (): boolean => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(MUSIC_MUTED_KEY) !== "false";
};

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
