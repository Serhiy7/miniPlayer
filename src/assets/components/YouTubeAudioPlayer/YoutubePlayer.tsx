import React, { useState, useRef, useEffect } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import Playlist, { PlaylistItem } from "./Playlist";
import Controls, { RepeatMode } from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import ThemeToggle from "./ThemeToggle";
import "./YouTubeAudioPlayer.css";

const STORAGE_KEY = "ytPlayerState";

const YouTubeAudioPlayer: React.FC = () => {
  // 1. Жёстко прописанный плейлист
  const playlist: PlaylistItem[] = [
    { videoId: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
    { videoId: "3tmd-ClpJxA", title: "Eminem – Lose Yourself" },
    { videoId: "JGwWNGJdvx8", title: "Ed Sheeran – Shape of You" },
  ];

  // Попытка загрузить сохранённое состояние из localStorage
  const savedState = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // Состояния
  const [currentIndex, setCurrentIndex] = useState<number>(
    savedState?.currentIndex ?? 0
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(savedState?.progress ?? 0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(savedState?.volume ?? 100);

  const [repeatMode, setRepeatMode] = useState<RepeatMode>(
    savedState?.repeatMode ?? "none"
  );
  const [isShuffle, setIsShuffle] = useState<boolean>(
    savedState?.isShuffle ?? false
  );

  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    savedState?.isDarkMode ?? false
  );

  const playerRef = useRef<YouTubePlayer | null>(null);

  // Опции для YouTube IFrame
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
    },
  };

  // Шаг 6: Тема — добавляет/удаляет класс "dark" у body
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Шаг 9: Сохраняем состояние в localStorage при изменении
  useEffect(() => {
    const stateToSave = {
      currentIndex,
      progress,
      volume,
      repeatMode,
      isShuffle,
      isDarkMode,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // если не получилось записать — игнорируем
    }
  }, [currentIndex, progress, volume, repeatMode, isShuffle, isDarkMode]);

  // Шаг 5: Горячие клавиши
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Проверяем, что фокус не в input/textarea
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowRight":
          if (playerRef.current) {
            const curr = playerRef.current.getCurrentTime();
            const seekTo = Math.min(curr + 5, duration);
            playerRef.current.seekTo(seekTo, true);
            setProgress(seekTo);
          }
          break;
        case "ArrowLeft":
          if (playerRef.current) {
            const curr = playerRef.current.getCurrentTime();
            const seekTo = Math.max(curr - 5, 0);
            playerRef.current.seekTo(seekTo, true);
            setProgress(seekTo);
          }
          break;
        case "ArrowUp":
          setVolume((prev) => {
            const newVol = Math.min(prev + 10, 100);
            playerRef.current?.setVolume(newVol);
            return newVol;
          });
          break;
        case "ArrowDown":
          setVolume((prev) => {
            const newVol = Math.max(prev - 10, 0);
            playerRef.current?.setVolume(newVol);
            return newVol;
          });
          break;
        case "KeyM":
          if (playerRef.current) {
            if (volume > 0) {
              playerRef.current.setVolume(0);
              setVolume(0);
            } else {
              playerRef.current.setVolume(50);
              setVolume(50);
            }
          }
          break;
        case "KeyN":
          playNext();
          break;
        case "KeyP":
          playPrev();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volume, isPlaying, currentIndex, duration]);

  // Коллбэк YouTube: когда плеер готов
  const onPlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target as YouTubePlayer;
    playerRef.current.setVolume(volume);

    // Если есть сохранённая позиция, делаем seek
    if (progress > 0) {
      playerRef.current.seekTo(progress, true);
    }

    if (isPlaying) {
      playerRef.current.playVideo();
    }

    // Через небольшую паузу получаем длительность
    setTimeout(() => {
      const dur = playerRef.current?.getDuration() ?? 0;
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    }, 500);
  };

  // Шаг 9: Обновляем progress в состоянии
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
  }, [isPlaying, currentIndex]);

  // Шаг 4: Рассчитать следующий индекс, учитывая shuffle и repeat
  const getNextIndex = (): number | null => {
    if (isShuffle) {
      return Math.floor(Math.random() * playlist.length);
    }
    let next = currentIndex + 1;
    if (next >= playlist.length) {
      if (repeatMode === "all") return 0;
      return null; // без повтора — конец
    }
    return next;
  };

  // Смена трека
  const changeTrack = (newIndex: number | null, autoPlay = true) => {
    if (newIndex === null) return;
    playerRef.current?.stopVideo();
    setCurrentIndex(newIndex);
    setProgress(0);
    setDuration(0);
    setIsPlaying(autoPlay);
  };

  const playNext = () => {
    if (repeatMode === "one") {
      // повтор текущего
      playerRef.current?.playVideo();
      return;
    }
    const nextIdx = getNextIndex();
    if (nextIdx !== null) {
      changeTrack(nextIdx, true);
    }
  };

  const playPrev = () => {
    if (isShuffle) {
      const rand = Math.floor(Math.random() * playlist.length);
      changeTrack(rand, true);
      return;
    }
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      if (repeatMode === "all") {
        prevIdx = playlist.length - 1;
      } else {
        return;
      }
    }
    changeTrack(prevIdx, true);
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  // Шаг 4: Когда видео заканчивается (state = 0)
  const onPlayerStateChange = (event: YouTubeEvent) => {
    if (event.data === 0) {
      playNext();
    }
  };

  const handleSeek = (time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
      setProgress(time);
    }
  };

  const handleVolume = (newVol: number) => {
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
    }
  };

  return (
    <div className="yt-audio-player-container">
      <div className="header-row">
        <h2>YouTube Мини-плеер</h2>
        <ThemeToggle
          isDarkMode={isDarkMode}
          onToggle={() => setIsDarkMode((prev) => !prev)}
        />
      </div>

      <Playlist
        items={playlist}
        currentIndex={currentIndex}
        onSelect={(idx) => changeTrack(idx, true)}
      />

      <YouTube
        videoId={playlist[currentIndex].videoId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
      />

      <Controls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onPrev={playPrev}
        onNext={playNext}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle((prev) => !prev)}
        repeatMode={repeatMode}
        onToggleRepeat={() => {
          const nextMode: RepeatMode =
            repeatMode === "none"
              ? "all"
              : repeatMode === "all"
              ? "one"
              : "none";
          setRepeatMode(nextMode);
        }}
      />

      <ProgressBar
        progress={progress}
        duration={duration}
        onSeek={(time) => handleSeek(time)}
      />

      <VolumeControl
        volume={volume}
        onVolumeChange={(vol) => handleVolume(vol)}
      />
    </div>
  );
};

export default YouTubeAudioPlayer;
