import React from 'react';
import { Game } from '../types';
import { Play, Star, Heart, ExternalLink, Sparkles } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      id={`game-card-${game.id}`}
      className="group relative flex flex-col bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-950/20 hover:-translate-y-1"
    >
      {/* Thumbnail & Badges Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950 cursor-pointer" onClick={() => onPlay(game)}>
        <img
          src={game.thumbnail}
          alt={game.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            // Fallback gradient if thumbnail fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded bg-zinc-900/90 backdrop-blur-md text-blue-400 border border-blue-500/30 uppercase">
            {game.category}
          </span>
          {game.featured && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-blue-600 text-white shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              HOT
            </span>
          )}
          {game.custom && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              CUSTOM
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          id={`fav-btn-${game.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          title={isFavorite ? 'Remove from Saved' : 'Save Game'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-md backdrop-blur-md z-10 transition-all ${
            isFavorite
              ? 'bg-rose-500/80 text-white'
              : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Play Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-zinc-950/40 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-bold text-xs shadow-lg shadow-blue-600/30 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-current" />
            <span>PLAY NOW</span>
          </div>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onPlay(game)}
              className="font-bold text-zinc-100 text-sm group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
            >
              {game.title}
            </h3>
            {game.rating && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 flex-shrink-0">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{game.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>
        </div>

        {/* Controls snippet & Action */}
        <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="truncate max-w-[170px]" title={game.controls || 'Keyboard / Touch'}>
            🎮 {game.controls || 'Keyboard / Touch'}
          </span>
          <button
            id={`play-btn-card-${game.id}`}
            onClick={() => onPlay(game)}
            className="text-blue-400 font-semibold hover:text-blue-300 flex items-center gap-1"
          >
            Launch
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
