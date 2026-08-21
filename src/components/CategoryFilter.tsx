import React from 'react';
import { CategoryFilterType, SortOption } from '../types';
import { Flame, Sparkles, Shapes, Crosshair, History, Brain, Heart, ArrowUpDown } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryFilterType;
  setSelectedCategory: (cat: CategoryFilterType) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  totalGames: number;
}

const CATEGORIES: { id: CategoryFilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'All', label: 'All Games', icon: Sparkles },
  { id: 'Arcade', label: 'Arcade', icon: Flame },
  { id: 'Puzzle', label: 'Puzzle', icon: Shapes },
  { id: 'Action', label: 'Action', icon: Crosshair },
  { id: 'Retro', label: 'Retro 8-Bit', icon: History },
  { id: 'Strategy', label: 'Strategy', icon: Brain },
  { id: 'Favorites', label: 'Saved', icon: Heart },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  totalGames,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-zinc-800">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-zinc-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort & Count */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-400">
        <span>
          Showing <strong className="text-zinc-200">{totalGames}</strong> games
        </span>

        <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <select
            id="sort-games-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="featured" className="bg-zinc-800 text-zinc-200">Featured First</option>
            <option value="rating" className="bg-zinc-800 text-zinc-200">Top Rated</option>
            <option value="title-asc" className="bg-zinc-800 text-zinc-200">Name (A-Z)</option>
            <option value="title-desc" className="bg-zinc-800 text-zinc-200">Name (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
