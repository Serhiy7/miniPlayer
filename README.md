# MiniPlayerForYoutube

Миниатюрный аудиоплеер на React + TypeScript с использованием YouTube IFrame API. Позволяет слушать YouTube-видео как аудио, управлять плейлистом, громкостью, прогрессом, режимами Repeat/Shuffle и переключать тему (Light/Dark).

## 🚀 Быстрый старт

### Клонировать и установить

git clone https://github.com/ВашеИмяПользователя/MiniPlayerForYoutube.git
cd MiniPlayerForYoutube
npm install

Запустить в режиме разработки

npm run dev

Откройте в браузере адрес, указанный Vite (по умолчанию http://localhost:5173).

Собрать готовый билд
npm run build
Для локального теста
npm run serve
📁 Структура проекта

src/
├── App.scss             # Глобальные переменные CSS
├── App.tsx              # Главный компонент
├── hooks/
│   └── useYouTubePlayer.ts   # Кастомный хук для YouTube IFrame API
└── components/
    ├── Controls/        # Prev/Play/Pause/Next/Shuffle/Repeat
    │   ├── Controls.tsx
    │   └── Controls.scss
    ├── Playlist/        # Список треков
    │   ├── Playlist.tsx
    │   └── Playlist.scss
    ├── ProgressBar/     # Прогресс-бар + время
    │   ├── ProgressBar.tsx
    │   └── ProgressBar.scss
    ├── VolumeControl/   # Ползунок громкости
    │   ├── VolumeControl.tsx
    │   └── VolumeControl.scss
    ├── ThemeToggle/     # Кнопка Light/Dark
    │   ├── ThemeToggle.tsx
    │   └── ThemeToggle.scss
    └── YouTubeAudioPlayer/   # «Обёртка», собирает всё вместе
        ├── YoutubePlayer.tsx
        └── YoutubePlayer.scss


## ✨ Фичи
Плейлист из YouTube Video ID с названиями.
Play/Pause, Prev/Next, Shuffle 🔀, Repeat ↻/🔁/🔂.
Прогресс-бар (текущее время / длительность).
Громкость 0–100.
Горячие клавиши:
Space → Play/Pause
←/→ → перемотка ±5 сек
↑/↓ → громкость ±10%
M → mute/unmute
N/P → Next/Prev
Light/Dark Theme (сохраняется в LocalStorage).
Сохранение состояния (текущий трек, позиция, громкость, режимы, тема) в LocalStorage.
🔧 Кастомный хук useYouTubePlayer
Реф playerRef на YouTubePlayer.
Методы: play(), pause(), seekTo(seconds), setVolume(vol).
Состояния: isPlaying, progress, duration, volume.
Колбэки: onReady, onStateChange.
## 🖋 Лицензия
Этот проект лицензирован по лицензии MIT. Подробнее см. в файле LICENSE.

Этот текст можно использовать в файле `README.md` вашего проекта на GitHub. Не забудьте заменить ссылку на скриншот на реальный скриншот вашего проекта.


