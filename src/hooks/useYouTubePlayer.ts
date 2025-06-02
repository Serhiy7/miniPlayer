import { useState, useRef, useEffect, useCallback } from "react";
import { YouTubeEvent, YouTubePlayer } from "react-youtube";

interface UseYouTubePlayerOptions {
  initialVolume?: number; // 0–100
  initialProgress?: number; // в секундах
  autoPlayInitial?: boolean; // сразу играть ли при готовности
}

interface UseYouTubePlayerResult {
  playerRef: React.MutableRefObject<YouTubePlayer | null>;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (vol: number) => void;
  onReady: (event: YouTubeEvent) => void;
  onStateChange: (event: YouTubeEvent) => void;
}

/**
 * useYouTubePlayer инкапсулирует:
 * - инициализацию YouTubePlayer (реф);
 * - play / pause / seek / volume;
 * - слежение за progress, duration, ended.
 */
export function useYouTubePlayer(
  options: UseYouTubePlayerOptions = {}
): UseYouTubePlayerResult {
  const {
    initialVolume = 100,
    initialProgress = 0,
    autoPlayInitial = false,
  } = options;

  const playerRef = useRef<YouTubePlayer | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayInitial);
  const [progress, setProgress] = useState<number>(initialProgress);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(initialVolume);

  // Таймер для обновления progress
  useEffect(() => {
    let intervalId: number | null = null;
    if (playerRef.current && isPlaying) {
      intervalId = window.setInterval(() => {
        const curr = playerRef.current!.getCurrentTime();
        setProgress(curr);
      }, 500);
    }
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  // play / pause / seek / setVolume
  const play = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
      setProgress(seconds);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    const newVol = Math.max(0, Math.min(100, vol));
    setVolumeState(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
    }
  }, []);

  // Колбэк, когда YouTube-плеер готов
  const onReady = useCallback(
    (event: YouTubeEvent) => {
      playerRef.current = event.target as YouTubePlayer;
      // Устанавливаем громкость
      playerRef.current.setVolume(volume);

      // Если есть сохранённая позиция, перемещаемся
      if (initialProgress > 0) {
        playerRef.current.seekTo(initialProgress, true);
      }

      // Автозапуск, если нужно
      if (autoPlayInitial) {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }

      // Через небольшую задержку получаем длительность
      setTimeout(() => {
        const dur = playerRef.current?.getDuration() ?? 0;
        if (!isNaN(dur) && dur > 0) {
          setDuration(dur);
        }
      }, 500);
    },
    [autoPlayInitial, initialProgress, volume]
  );

  // Колбэк, когда меняется состояние плеера (ENDED, BUFFERING и т. д.)
  const onStateChange = useCallback((event: YouTubeEvent) => {
    const state = event.data;
    // 0 → ENDED
    if (state === 0) {
      setIsPlaying(false);
      // компонент-родитель может подписаться на onStateChange и вызвать playNext()
    }
    // 1 → PLAYING
    if (state === 1) {
      setIsPlaying(true);
    }
    // 2 → PAUSED
    if (state === 2) {
      setIsPlaying(false);
    }
    // как только ролик начинает воспроизводиться, можно сразу обновить duration
    if (state === 1) {
      const dur = playerRef.current?.getDuration() ?? 0;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    }
  }, []);

  return {
    playerRef,
    isPlaying,
    progress,
    duration,
    volume,
    play,
    pause,
    seekTo,
    setVolume,
    onReady,
    onStateChange,
  };
}
