import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Audio sources for the game
 *
 * To use local audio files:
 * 1. Place your audio files in: src/assets/audio/
 * 2. Import them at the top of this file, e.g.:
 *    import lobbyMusic from '../assets/audio/lobby.mp3';
 * 3. Replace the URLs below with the imported variables
 *
 * Recommended audio format: MP3 or OGG for best browser support
 * Recommended audio specs: 128-192kbps, stereo
 */

// Using free royalty-free game music and sound effects from Pixabay
// Replace these URLs with your own audio files or keep the online sources
const AUDIO_SOURCES = {
  // Intense battle music - epic action style (used for lobby background)
  battle:
    "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  // Victory fanfare
  victory:
    "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3",
  // Attack sound effect - fireball/spell cast
  attack:
    "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3",
};

export const useAudio = (trackType, options = {}) => {
  const {
    volume = 0.3,
    loop = true,
    autoPlay = true,
    fadeIn = true,
    fadeInDuration = 2000,
  } = options;

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    // Check localStorage for mute preference
    const saved = localStorage.getItem("typeRoyaleMuted");
    return saved === "true";
  });
  const [currentVolume, setCurrentVolume] = useState(volume);

  // Initialize audio
  useEffect(() => {
    const audioSrc = AUDIO_SOURCES[trackType];
    if (!audioSrc) return;

    // Create audio element
    const audio = new Audio(audioSrc);
    audio.loop = loop;
    audio.volume = isMuted ? 0 : fadeIn ? 0 : volume;
    audioRef.current = audio;

    // Handle audio events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Auto play with fade in
    if (autoPlay && !isMuted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (fadeIn) {
              // Fade in effect
              let currentVol = 0;
              const fadeStep = volume / (fadeInDuration / 50);
              const fadeInterval = setInterval(() => {
                currentVol += fadeStep;
                if (currentVol >= volume) {
                  audio.volume = volume;
                  clearInterval(fadeInterval);
                } else {
                  audio.volume = currentVol;
                }
              }, 50);
            }
          })
          .catch((error) => {
            console.log("Audio autoplay prevented:", error);
          });
      }
    }

    // Cleanup
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);

      // Fade out before stopping
      if (audio.volume > 0) {
        const fadeOutInterval = setInterval(() => {
          if (audio.volume > 0.05) {
            audio.volume -= 0.05;
          } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeOutInterval);
          }
        }, 50);
      } else {
        audio.pause();
      }
    };
  }, [trackType, loop, autoPlay, fadeIn, fadeInDuration, volume, isMuted]);

  // Play function
  const play = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(console.log);
    }
  }, [isMuted]);

  // Pause function
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("typeRoyaleMuted", String(newMuted));

    if (audioRef.current) {
      if (newMuted) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = currentVolume;
        audioRef.current.play().catch(console.log);
      }
    }
  }, [isMuted, currentVolume]);

  // Set volume
  const setVolume = useCallback(
    (newVolume) => {
      setCurrentVolume(newVolume);
      if (audioRef.current && !isMuted) {
        audioRef.current.volume = newVolume;
      }
    },
    [isMuted]
  );

  return {
    isPlaying,
    isMuted,
    volume: currentVolume,
    play,
    pause,
    toggleMute,
    setVolume,
  };
};

/**
 * Hook for playing sound effects (non-looping, play on demand)
 * Perfect for attack sounds, hit sounds, etc.
 */
export const useSoundEffect = (soundType) => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("typeRoyaleMuted");
    return saved === "true";
  });

  // Initialize audio element
  useEffect(() => {
    const audioSrc = AUDIO_SOURCES[soundType];
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.loop = false;
    audio.volume = 0.5;
    audioRef.current = audio;

    // Listen for mute changes from localStorage
    const handleStorageChange = () => {
      const saved = localStorage.getItem("typeRoyaleMuted");
      setIsMuted(saved === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      audio.pause();
      audio.src = "";
    };
  }, [soundType]);

  // Play sound effect
  const play = useCallback(() => {
    if (audioRef.current && !isMuted) {
      // Reset to beginning if already playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.log);
    }
  }, [isMuted]);

  return { play, isMuted };
};

export default useAudio;
