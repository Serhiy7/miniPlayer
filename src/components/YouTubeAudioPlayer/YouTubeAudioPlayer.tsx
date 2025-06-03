// src/components/YouTubeAudioPlayer/YouTubeAudioPlayer.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactPlayer from "react-player";

import PlaylistSection, { PlaylistItem } from "./PlaylistSection";
import PlayerSection from "./PlayerSection";
import ControlsSection, { RepeatMode } from "./ControlsSection";
import ProgressSection from "./ProgressSection";
import VolumeSection from "./VolumeSection";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

import { usePlayerState } from "../../hooks/usePlayerState";
import { useAudioAnalyser } from "../../hooks/useAudioAnalyser";
import { usePlayerHandlers } from "../../hooks/usePlayerHandlers";

import "./YouTubeAudioPlayer.scss";

const STORAGE_KEY = "ytPlayerState";

const YouTubeAudioPlayer: React.FC = () => {
  // === 1. Плейлист ===
  const initialList: PlaylistItem[] = [
    { videoId: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
    { videoId: "3tmd-ClpJxA", title: "Eminem – Lose Yourself" },
    { videoId: "JGwWNGJdvx8", title: "Ed Sheeran – Shape of You" },
  ];

  // === 2. Загрузка state из localStorage ===
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  })();

  const [playlist, setPlaylist] = useState<PlaylistItem[]>(
    saved?.playlist ?? initialList
  );
  const [currentIndex, setCurrentIndex] = useState<number>(
    saved?.currentIndex ?? 0
  );
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(
    saved?.repeatMode ?? "none"
  );
  const [isShuffle, setIsShuffle] = useState<boolean>(
    saved?.isShuffle ?? false
  );
  const [isDark, setIsDark] = useState<boolean>(saved?.isDark ?? false);

  const initialProgress: number = saved?.progress ?? 0;
  const initialVolume: number = saved?.volume ?? 100;
  const autoPlayInitial = false;

  // === 3. Хук usePlayerState (с одним isPlaying) ===
  const playerRef = useRef<ReactPlayer | null>(null);
  const {
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
  } = usePlayerState(initialVolume, initialProgress, (sec) => {
    if (playerRef.current) {
      playerRef.current.seekTo(sec, "seconds");
    }
  });

  // === 4. Хук useAudioAnalyser ===
  const { audioAnalyserRef, initAnalyser } = useAudioAnalyser();

  // === 5. Коллбэки из usePlayerHandlers ===
  const {
    onReady,
    onProgress: handleProgress,
    onEnded: onPlayerEnded,
  } = usePlayerHandlers({
    playerRef,
    setDuration,
    setProgress,
    setIsPlaying: (flag: boolean) => {
      // Мы прямо устанавливаем isPlaying в usePlayerState
      if (flag) play();
      else pause();
    },
    initAnalyser,
    initialProgress,
    initialVolume,
    autoPlayInitial,
  });

  // === 6. Сохранение state в localStorage ===
  useEffect(() => {
    const toSave = {
      playlist,
      currentIndex,
      progress,
      volume,
      repeatMode,
      isShuffle,
      isDark,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [playlist, currentIndex, progress, volume, repeatMode, isShuffle, isDark]);

  // === 7. Dark Mode ===
  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

  // === 8. Горячие клавиши ===
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case "ArrowRight":
          seekTo(Math.min(progress + 5, duration));
          break;
        case "ArrowLeft":
          seekTo(Math.max(progress - 5, 0));
          break;
        case "ArrowUp":
          setVolume(Math.min(volume + 10, 100));
          break;
        case "ArrowDown":
          setVolume(Math.max(volume - 10, 0));
          break;
        case "KeyM":
          setVolume(volume > 0 ? 0 : 50);
          break;
        case "KeyN":
          playNext();
          break;
        case "KeyP":
          playPrev();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying, progress, duration, volume, pause, play, seekTo, setVolume]);

  // === 9. Логика Next / Prev / Repeat / Shuffle ===
  const getNextIndex = useCallback((): number | null => {
    if (isShuffle) {
      return Math.floor(Math.random() * playlist.length);
    }
    let next = currentIndex + 1;
    if (next >= playlist.length) {
      return repeatMode === "all" ? 0 : null;
    }
    return next;
  }, [currentIndex, isShuffle, repeatMode, playlist.length]);

  const changeTrack = useCallback(
    (newIndex: number | null, autoPlay = true) => {
      if (newIndex === null) return;
      setCurrentIndex(newIndex);
      seekTo(0);
      if (autoPlay) {
        setTimeout(() => play(), 200);
      }
    },
    [play, seekTo]
  );

  const playNext = useCallback(() => {
    if (repeatMode === "one") {
      play();
      return;
    }
    const next = getNextIndex();
    changeTrack(next, true);
  }, [changeTrack, getNextIndex, play, repeatMode]);

  const playPrev = useCallback(() => {
    if (isShuffle) {
      const rand = Math.floor(Math.random() * playlist.length);
      changeTrack(rand, true);
      return;
    }
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeatMode === "all") prevIndex = playlist.length - 1;
      else return;
    }
    changeTrack(prevIndex, true);
  }, [changeTrack, currentIndex, isShuffle, playlist.length, repeatMode]);

  // === 10. Автопереход при окончании трека ===
  const handleEnded = useCallback(() => {
    playNext();
  }, [playNext]);

  // === 11. Рендер ===
  return (
    <div className="yt-audio-player-container">
      {/* Header + ThemeToggle */}
      <div className="header-row">
        <h2>YouTube Мини-плеер</h2>
        <ThemeToggle
          isDarkMode={isDark}
          onToggle={() => setIsDark((p) => !p)}
        />
      </div>

      {/* 1) PlaylistSection */}
      <PlaylistSection
        items={playlist}
        currentIndex={currentIndex}
        onSelect={(idx) => changeTrack(idx, true)}
      />

      {/* 2) PlayerSection */}
      <PlayerSection
        playerRef={playerRef}
        url={`https://www.youtube.com/watch?v=${playlist[currentIndex].videoId}`}
        isPlaying={isPlaying}
        onReady={onReady}
        onProgress={handleProgress}
        onEnded={() => {
          onPlayerEnded();
          handleEnded();
        }}
        volume={volume}
      />

      {/* 3) ControlsSection */}
      <ControlsSection
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pause() : play())}
        onPrev={playPrev}
        onNext={playNext}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle((p) => !p)}
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

      {/* 4) ProgressSection */}
      <ProgressSection
        progress={progress}
        duration={duration}
        onSeek={(time) => seekTo(time)}
      />

      {/* 5) VolumeSection */}
      <VolumeSection volume={volume} onVolumeChange={(v) => setVolume(v)} />
    </div>
  );
};

export default YouTubeAudioPlayer;
