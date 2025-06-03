// src/hooks/usePlayerState.ts
import { useState, useCallback } from "react";

export interface UsePlayerStateResult {
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  setDuration: (dur: number) => void;
  setProgress: (sec: number) => void;
}

export function usePlayerState(
  initialVolume: number,
  initialProgress: number,
  onSeekExternal: (sec: number) => void
): UsePlayerStateResult {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(initialProgress);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(initialVolume);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      setProgress(seconds);
      onSeekExternal(seconds);
    },
    [onSeekExternal]
  );

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(100, vol));
    setVolumeState(clamped);
  }, []);

  return {
    isPlaying,
    progress,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume,
    setDuration,
    setProgress,
  };
}
