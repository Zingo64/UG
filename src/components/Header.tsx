import React, { useRef, useEffect } from 'react';
import { Gamepad2, Search, PlusCircle, Code, Shuffle, Heart, X } from 'lucide-react';
import { CategoryFilterType } from '../types';

interface HeaderProps {
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: CategoryFilterType;
  setSelectedCategory: (c: CategoryFilterType) => void;
  onRandomGame: () => void;
  onOpenAddModal: () => void;
  onOpenJsonModal: () => void;
  favoriteCount: number;
  activeGameId: string | null;
  onBackToGrid: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  onRandomGame,
  onOpenAddModal,
  onOpenJsonModal,
  favoriteCount,
  activeGameId,
  onBackToGrid,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        {/* Logo */}
        <button
          id="brand-logo-btn"
          onClick={onBackToGrid}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center font-black text-xl text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tighter text-zinc-100 flex items-center gap-1">
              ARCADE.<span className="text-blue-500">IO</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">Unblocked Games</p>
          </div>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block relative mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              id="global-search-input"
              type="text"
              placeholder="Search unblocked games... (Press '/' to focus)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-2 pl-10 pr-9 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-zinc-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons & Status */}
        <div className="flex items-center gap-2">
          {/* Quick Metrics Tag */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-800/60 rounded border border-zinc-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-blue-400">1.2k Online</span>
          </div>

          <button
            id="random-game-btn"
            onClick={onRandomGame}
            title="Play Random Game"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all active:scale-95"
          >
            <Shuffle className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Random</span>
          </button>

          <button
            id="fav-filter-btn"
            onClick={() => setSelectedCategory(selectedCategory === 'Favorites' ? 'All' : 'Favorites')}
            title="Favorites"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border transition-all active:scale-95 ${
              selectedCategory === 'Favorites'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'text-rose-400 fill-rose-400' : 'text-zinc-400'}`} />
            <span className="hidden md:inline">Saved</span>
            {favoriteCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {favoriteCount}
              </span>
            )}
          </button>

          <button
            id="json-viewer-btn"
            onClick={onOpenJsonModal}
            title="View games.json Database"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all active:scale-95"
          >
            <Code className="w-4 h-4 text-blue-400" />
            <span className="hidden lg:inline">JSON</span>
          </button>

          <button
            id="add-game-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Game</span>
          </button>
        </div>
      </div>

      {/* Mobile Search input */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800 text-zinc-100 pl-9 pr-8 py-2 rounded-full text-sm border border-zinc-700 focus:border-blue-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
