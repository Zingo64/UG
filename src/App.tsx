import React, { useState, useEffect, useMemo } from 'react';
import { Game, CategoryFilterType, SortOption } from './types';
import { DEFAULT_GAMES } from './data/defaultGames';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { JsonViewerModal } from './components/JsonViewerModal';
import { Gamepad2, Sparkles, Flame, History, Search, RefreshCw } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const savedCustom = localStorage.getItem('unblocked_custom_games');
      const customGames: Game[] = savedCustom ? JSON.parse(savedCustom) : [];
      return [...DEFAULT_GAMES, ...customGames];
    } catch {
      return DEFAULT_GAMES;
    }
  });
  const [loading, setLoading] = useState(false);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterType>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unblocked_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unblocked_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Load games from games.json if available
  useEffect(() => {
    async function fetchGames() {
      try {
        const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
        const res = await fetch(`${base}games.json`);
        if (!res.ok) return;
        const data: Game[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const savedCustom = localStorage.getItem('unblocked_custom_games');
          const customGames: Game[] = savedCustom ? JSON.parse(savedCustom) : [];
          setGames([...data, ...customGames]);
        }
      } catch (err) {
        console.warn('Note: using bundled default games library:', err);
      }
    }
    fetchGames();
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id];
      localStorage.setItem('unblocked_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Play Game Handler
  const handlePlayGame = (game: Game) => {
    setActiveGame(game);
    // Track recent
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      const updated = [game.id, ...filtered].slice(0, 10);
      localStorage.setItem('unblocked_recent', JSON.stringify(updated));
      return updated;
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Random Game
  const handleRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    handlePlayGame(games[randomIndex]);
  };

  // Add Custom Game
  const handleAddGame = (newGame: Game) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter((g) => g.custom);
      localStorage.setItem('unblocked_custom_games', JSON.stringify(customOnly));
      return updated;
    });
    handlePlayGame(newGame);
  };

  // Import custom JSON
  const handleImportJson = (imported: Game[]) => {
    setGames(imported);
    const customOnly = imported.filter((g) => g.custom);
    localStorage.setItem('unblocked_custom_games', JSON.stringify(customOnly));
  };

  // Filter and Sort games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Search term
        const matchesSearch =
          game.title.toLowerCase().includes(search.toLowerCase()) ||
          game.category.toLowerCase().includes(search.toLowerCase()) ||
          (game.description && game.description.toLowerCase().includes(search.toLowerCase()));

        if (!matchesSearch) return false;

        // Category filter
        if (selectedCategory === 'Favorites') {
          return favorites.includes(game.id);
        }
        if (selectedCategory === 'All') return true;
        return game.category.toLowerCase() === selectedCategory.toLowerCase();
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'title-desc') {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [games, search, selectedCategory, sortBy, favorites]);

  // Recently played game objects
  const recentGames = useMemo(() => {
    return recentIds
      .map((id) => games.find((g) => g.id === id))
      .filter((g): g is Game => Boolean(g))
      .slice(0, 5);
  }, [recentIds, games]);

  // Featured Game for Hero
  const featuredGame = useMemo(() => {
    return games.find((g) => g.featured) || games[0];
  }, [games]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Header
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onRandomGame={handleRandomGame}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
        favoriteCount={favorites.length}
        activeGameId={activeGame ? activeGame.id : null}
        onBackToGrid={() => setActiveGame(null)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* ACTIVE GAME PLAYER VIEW */}
        {activeGame ? (
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
            allGames={games}
            onSelectGame={handlePlayGame}
          />
        ) : (
          /* GALLERY & BROWSE VIEW */
          <div className="space-y-6">
            {/* Hero Banner when no search active and on All */}
            {!search && selectedCategory === 'All' && featuredGame && (
              <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-xl z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured HTML5 Game
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-zinc-100 tracking-tight leading-tight">
                    {featuredGame.title}
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed line-clamp-2">
                    {featuredGame.description}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      id="hero-play-btn"
                      onClick={() => handlePlayGame(featuredGame)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-95"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>Play Now</span>
                    </button>
                    <button
                      onClick={handleRandomGame}
                      className="px-5 py-2.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm border border-zinc-700 transition-all active:scale-95"
                    >
                      Surprise Me 🎲
                    </button>
                  </div>
                </div>

                {/* Featured Thumbnail */}
                <div
                  onClick={() => handlePlayGame(featuredGame)}
                  className="relative w-full md:w-80 aspect-[16/10] rounded-lg overflow-hidden shadow-2xl border border-zinc-800 group cursor-pointer flex-shrink-0"
                >
                  <img
                    src={featuredGame.thumbnail}
                    alt={featuredGame.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-md shadow-md">
                      Launch Game
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recently Played Quick Bar */}
            {!search && selectedCategory === 'All' && recentGames.length > 0 && (
              <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-3 bg-blue-500 rounded-full"></div>
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  Jump Back In
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {recentGames.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handlePlayGame(g)}
                      className="flex items-center gap-2.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left whitespace-nowrap transition-all group flex-shrink-0"
                    >
                      <img
                        src={g.thumbnail}
                        alt={g.title}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded object-cover bg-zinc-950"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">
                          {g.title}
                        </div>
                        <div className="text-[10px] text-zinc-500">{g.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Navigation & Sort Bar */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalGames={filteredGames.length}
            />

            {/* Game Cards Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-sm font-semibold text-zinc-400">Loading games catalog...</p>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-20 bg-zinc-900/40 rounded-xl border border-zinc-800 p-8">
                <Gamepad2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-zinc-300 mb-1">No games found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                  {search
                    ? `No matches for "${search}". Try checking your spelling or search another keyword.`
                    : selectedCategory === 'Favorites'
                    ? "You haven't saved any games to your favorites yet. Click the heart icon on any card to save it!"
                    : 'No games available in this category.'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {(search || selectedCategory !== 'All') && (
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedCategory('All');
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-md border border-zinc-700 transition-all"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-md transition-all shadow-md shadow-blue-600/20"
                  >
                    Add Custom Game
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-zinc-400">ARCADE.IO</span>
            <span>•</span>
            <span className="text-zinc-500">JSON Database &amp; Iframe Player</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Servers: Operational
            </span>
            <button onClick={() => setIsJsonModalOpen(true)} className="hover:text-zinc-300">
              games.json
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="hover:text-zinc-300">
              Add Game
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportJson={handleImportJson}
      />
    </div>
  );
}
