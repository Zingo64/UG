import React, { useState } from 'react';
import { Game } from '../types';
import { X, Plus, Globe, Sparkles, Image, Gamepad } from 'lucide-react';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: Game) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Game['category']>('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const newGame: Game = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      url: url.trim(),
      category,
      description: description.trim() || 'Custom embedded HTML5 game.',
      controls: controls.trim() || 'Keyboard & Mouse / Touch',
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
      custom: true,
      rating: 5.0,
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setUrl('');
    setDescription('');
    setControls('');
    setThumbnail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">Add Custom Game Iframe</h2>
              <p className="text-xs text-zinc-400">Embed any HTML5 game URL into your catalog</p>
            </div>
          </div>
          <button
            id="close-add-modal-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Game Title *</label>
            <input
              id="new-game-title-input"
              type="text"
              required
              placeholder="e.g. Slope 3D / Super Mario HTML5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Iframe Embed URL / Game Web Link *
            </label>
            <input
              id="new-game-url-input"
              type="url"
              required
              placeholder="https://example.com/embed/game"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Category</label>
              <select
                id="new-game-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Game['category'])}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Retro">Retro</option>
                <option value="Strategy">Strategy</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-zinc-400" />
                Thumbnail URL (Optional)
              </label>
              <input
                id="new-game-thumb-input"
                type="url"
                placeholder="https://... image link"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
              <Gamepad className="w-3.5 h-3.5 text-zinc-400" />
              Controls Guide (Optional)
            </label>
            <input
              id="new-game-controls-input"
              type="text"
              placeholder="e.g. WASD to drive, Space for nitro"
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Description (Optional)</label>
            <textarea
              id="new-game-desc-input"
              rows={2}
              placeholder="Brief summary of the game..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              id="submit-add-game-btn"
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
