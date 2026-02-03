
import React, { useState } from 'react';
import { Bookmark } from '../types';
import { analyzeBookmark } from '../services/geminiService';

interface AIOrganizerProps {
  bookmarks: Bookmark[];
  onUpdateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkUpdate?: (updates: { id: string; updates: Partial<Bookmark> }[]) => void;
}

const AIOrganizer: React.FC<AIOrganizerProps> = ({ 
  bookmarks, 
  onUpdateBookmark, 
  onBulkDelete,
  onBulkUpdate 
}) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleSmartAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    
    setIsAdding(true);
    try {
      const result = await analyzeBookmark(newUrl, "New Bookmark");
      const newBookmark: Bookmark = {
        id: Math.random().toString(36).substring(7),
        url: newUrl,
        title: newUrl.replace('https://', '').split('/')[0],
        category: result.category,
        tags: result.tags,
        addedAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        isStale: false,
        summary: result.summary,
        favicon: `https://www.google.com/s2/favicons?domain=${newUrl}&sz=64`
      };
      onUpdateBookmark('DUMMY', newBookmark); 
      setNewUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleStaleScan = () => {
    setIsScanning(true);
    setScanMessage(null);
    
    // Simulate a bit of processing delay for "AI magic" feel
    setTimeout(() => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const staleUpdates = bookmarks
        .filter(b => !b.isStale && new Date(b.lastAccessed) < sixMonthsAgo)
        .map(b => ({ id: b.id, updates: { isStale: true } }));

      if (staleUpdates.length > 0) {
        onBulkUpdate?.(staleUpdates);
        setScanMessage(`Success! Identified ${staleUpdates.length} inactive bookmarks from the last 6 months.`);
      } else {
        setScanMessage("Your library is healthy! No new stale bookmarks found.");
      }
      setIsScanning(false);
    }, 1500);
  };

  const handlePurgeStale = () => {
    const staleIds = bookmarks.filter(b => b.isStale).map(b => b.id);
    if (staleIds.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete all ${staleIds.length} stale bookmarks? This cannot be undone.`)) {
      onBulkDelete?.(staleIds);
      setScanMessage("Cleanup complete. Stale bookmarks have been purged.");
    }
  };

  const runAnalysis = async (bookmark: Bookmark) => {
    setAnalyzingId(bookmark.id);
    try {
      const result = await analyzeBookmark(bookmark.url, bookmark.title);
      onUpdateBookmark(bookmark.id, {
        category: result.category,
        tags: result.tags,
        summary: result.summary
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingId(null);
    }
  };

  const staleCount = bookmarks.filter(b => b.isStale).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Smart AI Organizer</h2>
        <p className="text-slate-500 mt-2">Let Gemini sort, summarize, and tag your messy library.</p>
      </div>

      {/* Stale Management Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">
              🧹
            </div>
            <div>
              <h3 className="text-xl font-bold">Library Health Check</h3>
              <p className="text-slate-400 text-sm">Automatically find and clean up bookmarks older than 6 months.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleStaleScan}
              disabled={isScanning}
              className={`px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold transition-all flex items-center gap-2 ${isScanning ? 'opacity-50 cursor-wait' : ''}`}
            >
              {isScanning ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Scan Inactivity'}
            </button>
            {staleCount > 0 && (
              <button
                onClick={handlePurgeStale}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl font-bold transition-all"
              >
                Purge {staleCount} Stale
              </button>
            )}
          </div>
        </div>
        {scanMessage && (
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-indigo-400">✨</span>
            {scanMessage}
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">✨</span> Smart Add URL
        </h3>
        <form onSubmit={handleSmartAdd} className="flex gap-3">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Paste a messy URL here..."
            className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700"
          />
          <button
            type="submit"
            disabled={isAdding}
            className={`px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Analyze & Add'
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Unsummarized Content</h3>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Batch Analyze All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {bookmarks.filter(b => !b.summary).map((b) => (
            <div key={b.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">
                  {b.favicon ? <img src={b.favicon} className="w-6 h-6 object-contain" alt="" /> : '🔗'}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{b.title}</h4>
                  <p className="text-xs text-slate-400">{b.url}</p>
                </div>
              </div>
              <button
                onClick={() => runAnalysis(b)}
                disabled={analyzingId === b.id}
                className={`px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all ${analyzingId === b.id ? 'animate-pulse bg-indigo-50' : ''}`}
              >
                {analyzingId === b.id ? 'Thinking...' : 'Analyze'}
              </button>
            </div>
          ))}
          {bookmarks.filter(b => !b.summary).length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-slate-500 font-medium">All bookmarks are summarized!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIOrganizer;
