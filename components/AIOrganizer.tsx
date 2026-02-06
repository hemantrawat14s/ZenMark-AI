
import React, { useState, useRef } from 'react';
import { Bookmark } from '../types';
import { analyzeBookmark } from '../services/geminiService';

interface AIOrganizerProps {
  bookmarks: Bookmark[];
  onUpdateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  onBulkDelete?: (ids: string[]) => void;
  onBulkUpdate?: (updates: { id: string; updates: Partial<Bookmark> }[]) => void;
  onAddBatch?: (newBookmarks: Bookmark[]) => void;
}

const AIOrganizer: React.FC<AIOrganizerProps> = ({ 
  bookmarks, 
  onUpdateBookmark, 
  onBulkDelete,
  onBulkUpdate,
  onAddBatch
}) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const parseBookmarkFile = (content: string): Partial<Bookmark>[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const links = doc.querySelectorAll('a');
    const results: Partial<Bookmark>[] = [];

    links.forEach(link => {
      const href = link.getAttribute('href');
      const title = link.textContent || 'Untitled';
      const addDate = link.getAttribute('add_date');
      
      if (href && href.startsWith('http')) {
        results.push({
          url: href,
          title: title,
          addedAt: addDate ? new Date(parseInt(addDate) * 1000).toISOString() : new Date().toISOString()
        });
      }
    });

    return results;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseBookmarkFile(content);
      
      const newBookmarks: Bookmark[] = parsed.map(p => ({
        id: Math.random().toString(36).substring(7),
        url: p.url!,
        title: p.title!,
        category: 'Uncategorized',
        tags: ['Imported'],
        addedAt: p.addedAt!,
        lastAccessed: new Date().toISOString(),
        isStale: false,
        favicon: `https://www.google.com/s2/favicons?domain=${p.url}&sz=64`
      }));

      onAddBatch?.(newBookmarks);
      setScanMessage(`Imported ${newBookmarks.length} bookmarks successfully! Ready for AI categorization.`);
      setImporting(false);
    };
    reader.readAsText(file);
  };

  const handleSyncBrowser = () => {
    setIsScanning(true);
    // Simulate fetching from chrome.bookmarks API
    setTimeout(() => {
      const simulatedSync: Bookmark[] = [
        {
          id: 'sync-1',
          url: 'https://github.com',
          title: 'GitHub: Where the world builds software',
          category: 'Uncategorized',
          tags: ['Synced'],
          addedAt: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          isStale: false,
          favicon: 'https://github.com/favicon.ico'
        }
      ];
      onAddBatch?.(simulatedSync);
      setScanMessage("Browser sync complete! 1 new bookmark found.");
      setIsScanning(false);
    }, 2000);
  };

  // Fix: Implemented runAnalysis to handle individual bookmark analysis via Gemini
  const runAnalysis = async (b: Bookmark) => {
    setAnalyzingId(b.id);
    try {
      const result = await analyzeBookmark(b.url, b.title);
      onUpdateBookmark(b.id, {
        category: result.category,
        tags: result.tags,
        summary: result.summary
      });
    } catch (err) {
      console.error(`Failed to analyze ${b.title}`, err);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleBatchCategorize = async () => {
    const unorganized = bookmarks.filter(b => !b.summary || b.category === 'Uncategorized');
    if (unorganized.length === 0) {
      setScanMessage("Everything is already organized!");
      return;
    }

    setBatchProcessing(true);
    setScanMessage(`Processing ${unorganized.length} bookmarks...`);

    const bulkUpdates: { id: string; updates: Partial<Bookmark> }[] = [];
    
    for (const b of unorganized) {
      try {
        const result = await analyzeBookmark(b.url, b.title);
        bulkUpdates.push({
          id: b.id,
          updates: {
            category: result.category,
            tags: result.tags,
            summary: result.summary
          }
        });
      } catch (err) {
        console.error(`Failed to analyze ${b.title}`, err);
      }
    }

    if (bulkUpdates.length > 0) {
      onBulkUpdate?.(bulkUpdates);
      setScanMessage(`Successfully organized ${bulkUpdates.length} bookmarks!`);
    }
    setBatchProcessing(false);
  };

  const staleCount = bookmarks.filter(b => b.isStale).length;
  const unorganizedCount = bookmarks.filter(b => !b.summary || b.category === 'Uncategorized').length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Smart AI Organizer</h2>
        <p className="text-slate-500 mt-2">Let Gemini sort, summarize, and tag your messy library.</p>
      </div>

      {/* Import & Sync Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl mb-4 text-indigo-600">
            📁
          </div>
          <h3 className="text-lg font-bold text-slate-800">Import HTML File</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Support for Chrome, Safari, Firefox, and Edge bookmark exports (.html, .htm)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept=".html,.htm" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {importing ? 'Reading...' : 'Choose File'}
          </button>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-violet-50 rounded-3xl flex items-center justify-center text-3xl mb-4 text-violet-600">
            🌐
          </div>
          <h3 className="text-lg font-bold text-slate-800">Browser Sync</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">Directly sync bookmarks from your active browser session via extension API.</p>
          <button 
            onClick={handleSyncBrowser}
            disabled={isScanning}
            className="w-full py-3 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2"
          >
            {isScanning ? 'Syncing...' : 'Start Sync'}
          </button>
        </div>
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
                onClick={() => onBulkDelete?.(bookmarks.filter(b => b.isStale).map(b => b.id))}
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
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800">Pending Organization</h3>
            <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {unorganizedCount}
            </span>
          </div>
          <button 
            onClick={handleBatchCategorize}
            disabled={batchProcessing || unorganizedCount === 0}
            className={`text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {batchProcessing ? (
               <>
                 <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                 Organizing...
               </>
            ) : 'Categorize All via AI'}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {bookmarks.filter(b => !b.summary || b.category === 'Uncategorized').map((b) => (
            <div key={b.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">
                  {b.favicon ? <img src={b.favicon} className="w-6 h-6 object-contain" alt="" /> : '🔗'}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800 truncate max-w-[200px] md:max-w-md">{b.title}</h4>
                  <p className="text-xs text-slate-400 truncate max-w-[200px] md:max-w-md">{b.url}</p>
                </div>
              </div>
              <button
                onClick={() => runAnalysis(b)}
                disabled={analyzingId === b.id || batchProcessing}
                className={`px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all ${analyzingId === b.id ? 'animate-pulse bg-indigo-50' : ''} disabled:opacity-50 flex-shrink-0`}
              >
                {analyzingId === b.id ? 'Thinking...' : 'Analyze'}
              </button>
            </div>
          ))}
          {bookmarks.filter(b => !b.summary || b.category === 'Uncategorized').length === 0 && (
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
