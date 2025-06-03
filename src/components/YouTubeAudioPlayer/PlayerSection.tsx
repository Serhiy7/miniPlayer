// src/components/YouTubeAudioPlayer/PlayerSection.tsx
import React from "react";
import ReactPlayer from "react-player";
import "./PlayerSection.scss";

interface PlayerSectionProps {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  url: string;
  isPlaying: boolean; // <- именно этот флаг определяет воспроизведение
  onReady: () => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  volume: number;
}

const PlayerSection: React.FC<PlayerSectionProps> = ({
  playerRef,
  url,
  isPlaying,
  onReady,
  onProgress,
  onEnded,
  volume,
}) => {
  return (
    <div className="player-section">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls={false}
        width="0"
        height="0"
        onReady={onReady}
        onProgress={onProgress}
        onEnded={onEnded}
        volume={volume / 100}
      />
      <canvas id="visualizer" width={350} height={100} />
    </div>
  );
};

export default PlayerSection;
