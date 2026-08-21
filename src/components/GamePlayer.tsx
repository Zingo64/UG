import React, { useState, useRef, useEffect } from 'react';
import { Game } from '../types';
import {
  ArrowLeft,
  Maximize,
  Minimize,
  RotateCw,
  ExternalLink,
  Heart,
  Star,
  Info,
  Tv,
  Sparkles,
  Gamepad2,
  ChevronRight
} from 'lucide-react';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  allGames: Game[];
  onSelectGame: (game: Game) => void;
}

export const GamePlayer: React.FC<GamePlayerProps> = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
  allGames,
  onSelectGame,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle browser fullscreen events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const reloadGame = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Up next games (exclude current)
  const upNextGames = allGames.filter((g) => g.id !== game.id).slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 backdrop-blur-sm">
        <button
          id="player-back-btn"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded-md border border-zinc-700 transition-all active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        {/* Game Title & Category Badge */}
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-600/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            {game.category}
          </span>
          <h1 className="text-base sm:text-lg font-black text-zinc-100 truncate max-w-xs sm:max-w-md">
            {game.title}
          </h1>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="player-fav-btn"
            onClick={() => onToggleFavorite(game.id)}
            title={isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            className={`p-2 rounded-md border transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'text-zinc-400 bg-zinc-800 hover:text-white hover:bg-zinc-700 border-zinc-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            id="player-reload-btn"
            onClick={reloadGame}
            title="Reload Game Frame"
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            id="player-theater-btn"
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Default Size' : 'Theater Wide Mode'}
            className={`p-2 rounded-md border transition-all ${
              isTheater
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'text-zinc-400 bg-zinc-800 hover:text-white hover:bg-zinc-700 border-zinc-700'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>

          <button
            id="player-fullscreen-btn"
            onClick={toggleFullscreen}
            title="Fullscreen Player"
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <a
            id="player-newtab-btn"
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Direct Standalone Tab"
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Iframe Player Frame */}
      <div
        ref={containerRef}
        id="game-player-frame-container"
        className={`relative mx-auto bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-screen border-none rounded-none'
            : isTheater
            ? 'w-full max-w-6xl aspect-[16/10]'
            : 'w-full max-w-4xl aspect-[16/10]'
        }`}
      >
        <iframe
          ref={iframeRef}
          key={iframeKey}
          id="game-active-iframe"
          src={game.url}
          title={game.title}
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
          allowFullScreen
          className="w-full h-full border-0 bg-zinc-950"
        />

        {/* Floating In-Game Overlay Controls on Hover in Fullscreen */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md p-2 rounded-lg border border-zinc-700 shadow-lg opacity-20 hover:opacity-100 transition-opacity">
            <button
              onClick={reloadGame}
              className="p-2 text-zinc-200 hover:text-white hover:bg-zinc-800 rounded"
              title="Reload Game"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-zinc-200 hover:text-white hover:bg-zinc-800 rounded"
              title="Exit Fullscreen"
            >
              <Minimize className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Game Details & Controls Bar */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto ${isTheater ? 'max-w-6xl' : 'max-w-4xl'}`}>
        {/* Left Column: Details & Instructions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                About {game.title}
              </h2>
              {game.rating && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{game.rating.toFixed(1)} / 5.0</span>
                </div>
              )}
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">{game.description}</p>

            {/* Controls Box */}
            <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
                Game Controls
              </div>
              <div className="text-xs text-blue-300 font-mono bg-blue-950/20 p-2.5 rounded border border-blue-500/20">
                {game.controls || 'Arrow Keys / WASD / Spacebar / Touch & Click'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Up Next Recommended Games */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
            <div className="w-1.5 h-3 bg-blue-500 rounded-full"></div>
            More Games
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {upNextGames.map((g) => (
              <button
                key={g.id}
                id={`next-game-${g.id}`}
                onClick={() => onSelectGame(g)}
                className="flex items-center gap-3 p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all text-left group"
              >
                <img
                  src={g.thumbnail}
                  alt={g.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-12 rounded-lg object-cover bg-zinc-950 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-zinc-200 group-hover:text-blue-400 transition-colors truncate">
                    {g.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium">{g.category}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
