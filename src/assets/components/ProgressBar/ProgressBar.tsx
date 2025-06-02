import React from "react";

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  duration,
  onSeek,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className="yt-progress-container">
      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={progress}
        onChange={handleChange}
        className="yt-progress-bar"
      />
      <div className="yt-time-labels">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

// Вспомогательная функция форматирования секунд → mm:ss
function formatTime(time: number): string {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

export default ProgressBar;
