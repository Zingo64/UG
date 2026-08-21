import React, { useState } from 'react';
import { Game } from '../types';
import { X, Copy, Check, Download, Upload, Code } from 'lucide-react';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: Game[];
  onImportJson: (imported: Game[]) => void;
}

export const JsonViewerModal: React.FC<JsonViewerModalProps> = ({
  isOpen,
  onClose,
  games,
  onImportJson,
}) => {
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [activeTab, setActiveTab] = useState<'view' | 'import'>('view');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(games, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON root must be an array of game objects.');
      }
      onImportJson(parsed);
      onClose();
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON syntax');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">games.json Database</h2>
              <p className="text-xs text-zinc-400">View or import the underlying JSON catalog</p>
            </div>
          </div>
          <button
            id="close-json-modal-btn"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 pt-3 pb-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'view'
                ? 'bg-zinc-800 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Current JSON ({games.length} Games)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'import'
                ? 'bg-zinc-800 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Import Custom JSON
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden my-2 flex flex-col">
          {activeTab === 'view' ? (
            <div className="relative flex-1 bg-zinc-950 rounded-lg border border-zinc-800 p-3 overflow-auto font-mono text-xs text-blue-400/90 leading-relaxed scrollbar-thin">
              <pre>{jsonString}</pre>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                id="import-json-textarea"
                placeholder='Paste custom games JSON array here... e.g. [{"id":"game1", "title":"My Game", "url":"https://..."}]'
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="flex-1 w-full bg-zinc-950 rounded-lg border border-zinc-800 p-3 font-mono text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 resize-none"
              />
              {importError && (
                <div className="text-xs text-rose-400 bg-rose-950/30 p-2 rounded-lg border border-rose-500/30 font-mono">
                  {importError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800 flex-shrink-0">
          {activeTab === 'view' ? (
            <div className="flex items-center gap-2">
              <button
                id="copy-json-btn"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                id="download-json-btn"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download games.json</span>
              </button>
            </div>
          ) : (
            <button
              id="apply-import-json-btn"
              onClick={handleImport}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-md transition-all ml-auto"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace / Load Games</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-all ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
