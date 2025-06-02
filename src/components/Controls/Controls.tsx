import React from "react";

export type RepeatMode = "none" | "one" | "all";

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
}) => {
  // Для отображения иконки repeat
  const repeatIcon = () => {
    if (repeatMode === "one") return "🔂";
    if (repeatMode === "all") return "🔁";
    return "↻";
  };

  // title для кнопки repeat
  const repeatTitle = () => {
    if (repeatMode === "one") return "Repeat One";
    if (repeatMode === "all") return "Repeat All";
    return "No Repeat";
  };

  return (
    <div className="yt-controls">
      <button
        onClick={onToggleShuffle}
        className={`yt-btn ${isShuffle ? "active" : ""}`}
        title="Shuffle"
      >
        🔀
      </button>
      <button onClick={onPrev} className="yt-btn" title="Previous">
        ⏮️
      </button>
      <button onClick={onPlayPause} className="yt-btn" title="Play/Pause">
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <button onClick={onNext} className="yt-btn" title="Next">
        ⏭️
      </button>
      <button
        onClick={onToggleRepeat}
        className={`yt-btn ${repeatMode !== "none" ? "active" : ""}`}
        title={repeatTitle()}
      >
        {repeatIcon()}
      </button>
    </div>
  );
};

export default Controls;
