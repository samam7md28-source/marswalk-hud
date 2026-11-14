const AUDIO_CONFIG = {
  enabled: true,
  volumeSFX: 0.6,
  volumeAmbient: 0.3
};

// Cache loaded audio instances to avoid re-fetching
const soundCache = {};

/**
 * Safely plays a sound effect from assets/audio/
 * @param {string} filename - e.g. 'beep.mp3' or 'boot.wav'
 */
function playSFX(filename) {
  if (!AUDIO_CONFIG.enabled) return;

  try {
    const path = `assets/audio/${filename}`;
    if (!soundCache[path]) {
      soundCache[path] = new Audio(path);
    }
    
    const sound = soundCache[path].cloneNode(); // Allows overlapping sounds
    sound.volume = AUDIO_CONFIG.volumeSFX;
    sound.play().catch(err => {
      console.log(`Audio autoplay blocked or file missing (${filename}):`, err);
    });
  } catch (err) {
    console.warn("Audio system error:", err);
  }
}

/**
 * Starts continuous ambient background audio (e.g., Mars wind)
 * @param {string} filename - e.g. 'mars_wind.wav'
 */
let ambientTrack = null;
function startAmbient(filename) {
  if (!AUDIO_CONFIG.enabled) return;

  try {
    if (!ambientTrack) {
      ambientTrack = new Audio(`assets/audio/${filename}`);
      ambientTrack.loop = true;
      ambientTrack.volume = AUDIO_CONFIG.volumeAmbient;
    }

    ambientTrack.play().catch(err => {
      console.log("Ambient audio waiting for user interaction, will retry on click.");
    });
  } catch (err) {
    console.warn("Ambient audio error:", err);
  }
}

// Automatically wake up ambient track on the very first user click anywhere
document.addEventListener('click', () => {
  if (ambientTrack && ambientTrack.paused) {
    ambientTrack.play().catch(err => {
      console.log("Ambient auto-resume blocked:", err);
    });
  }
}, { once: true });

function stopAmbient() {
  if (ambientTrack) {
    ambientTrack.pause();
    ambientTrack = null;
  }
}

// Global audio helper accessible from hud.js, panorama.js, or logic.js
window.AudioEngine = {
  play: playSFX,
  startAmbient: startAmbient,
  stopAmbient: stopAmbient,
  setVolumeSFX: (v) => { AUDIO_CONFIG.volumeSFX = Math.max(0, Math.min(1, v)); },
  setVolumeAmbient: (v) => { 
    AUDIO_CONFIG.volumeAmbient = Math.max(0, Math.min(1, v));
    if (ambientTrack) ambientTrack.volume = AUDIO_CONFIG.volumeAmbient;
  }
};