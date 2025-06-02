import React from "react";

export interface PlaylistItem {
  videoId: string;
  title: string;
}

interface PlaylistProps {
  items: PlaylistItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const Playlist: React.FC<PlaylistProps> = ({
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

export default Playlist;
