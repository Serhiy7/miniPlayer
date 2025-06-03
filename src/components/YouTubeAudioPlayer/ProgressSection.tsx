// src/components/YouTubeAudioPlayer/ProgressSection.tsx
import React from "react";
import "./ProgressSection.scss";

interface ProgressSectionProps {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({
  progress,
  duration,
  onSeek,
}) => {
  const formatTime = (time: number): string => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className="yt-progress-container">
      <div className="time-display">
        <span className="current-time">{formatTime(progress)}</span>
        <span className="total-time">{formatTime(duration)}</span>
      </div>
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={progress}
        onChange={handleChange}
        className="yt-progress-bar"
      />
    </div>
  );
};

export default ProgressSection;
