// src/components/YouTubeAudioPlayer/PlaylistSection.tsx
import React from "react";
import "./PlaylistSection.scss";

export interface PlaylistItem {
  videoId: string;
  title: string;
}

interface PlaylistSectionProps {
  items: PlaylistItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  items,
  currentIndex,
  onSelect,
}) => {
  return (
    <ul className="yt-playlist">
      {items.map((item, idx) => (
        <li
          key={item.videoId}
          className={
            idx === currentIndex
              ? "yt-playlist-item active"
              : "yt-playlist-item"
          }
          onClick={() => onSelect(idx)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default PlaylistSection;
