// src/components/YouTubeAudioPlayer/VolumeSection.tsx
import React from "react";
import "./VolumeSection.scss";

interface VolumeSectionProps {
  volume: number;
  onVolumeChange: (vol: number) => void;
}

const VolumeSection: React.FC<VolumeSectionProps> = ({
  volume,
  onVolumeChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    onVolumeChange(newVol);
  };

  return (
    <div className="yt-volume-container">
      <label htmlFor="yt-volume">Громкость:</label>
      <input
        id="yt-volume"
        type="range"
        min="0"
        max="100"
        step="1"
        value={volume}
        onChange={handleChange}
      />
    </div>
  );
};

export default VolumeSection;
