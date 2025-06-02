import React from "react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (newVolume: number) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
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

export default VolumeControl;
