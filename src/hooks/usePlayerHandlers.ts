// src/hooks/usePlayerHandlers.ts
import { useCallback } from "react";
import ReactPlayer from "react-player";

interface UsePlayerHandlersParams {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  setDuration: (dur: number) => void;
  setProgress: (sec: number) => void;
  setIsPlaying: (flag: boolean) => void;
  initAnalyser: (media: unknown) => void;
  initialProgress: number;
  initialVolume: number;
  autoPlayInitial: boolean;
}

export function usePlayerHandlers({
  playerRef,
  setDuration,
  setProgress,
  setIsPlaying,
  initAnalyser,
  initialProgress,
  initialVolume,
  autoPlayInitial,
}: UsePlayerHandlersParams) {
  const onReady = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const internal = player.getInternalPlayer();

    if (internal instanceof HTMLMediaElement) {
      // Инициализируем анализатор
      initAnalyser(internal);

      // Ставим громкость на HTMLMediaElement
      internal.volume = initialVolume / 100;

      // Если есть сохранённая позиция
      if (initialProgress > 0) {
        internal.currentTime = initialProgress;
      }

      // Обновляем длительность
      const dur = internal.duration;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }

      // Автоплей, если нужно
      if (autoPlayInitial) {
        internal.play();
        setIsPlaying(true);
      }
    } else {
      // Для YouTube-iframe просто переключаем флаг
      setIsPlaying(autoPlayInitial);
    }
  }, [
    autoPlayInitial,
    initialProgress,
    initialVolume,
    initAnalyser,
    playerRef,
    setDuration,
    setIsPlaying,
  ]);

  const onProgress = useCallback(
    (state: { playedSeconds: number }) => {
      setProgress(state.playedSeconds);
    },
    [setProgress]
  );

  const onEnded = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  return {
    onReady,
    onProgress,
    onEnded,
  };
}
