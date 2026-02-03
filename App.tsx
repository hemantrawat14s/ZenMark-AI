
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookmarkCard from './components/BookmarkCard';
import AIOrganizer from './components/AIOrganizer';
import { Bookmark, ViewMode } from './types';
import { INITIAL_BOOKMARKS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(INITIAL_BOOKMARKS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = useMemo(() => {
    let result = bookmarks;
    
    if (searchQuery) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (view === ViewMode.STALE) {
      return result.filter(b => b.isStale);
    }
    
    return result;
  }, [bookmarks, searchQuery, view]);

  const staleCount = useMemo(() => bookmarks.filter(b => b.isStale).length, [bookmarks]);

  const handleDelete = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleBulkDelete = (ids: string[]) => {
    setBookmarks(prev => prev.filter(b => !ids.includes(b.id)));
  };

  const handleUpdate = (id: string, updates: Partial<Bookmark>) => {
    if (id === 'DUMMY') {
      // Logic for adding a new bookmark
      setBookmarks(prev => [updates as Bookmark, ...prev]);
      return;
    }
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleBulkUpdate = (bulkUpdates: { id: string; updates: Partial<Bookmark> }[]) => {
    setBookmarks(prev => {
      const newBookmarks = [...prev];
      bulkUpdates.forEach(({ id, updates }) => {
        const index = newBookmarks.findIndex(b => b.id === id);
        if (index !== -1) {
          newBookmarks[index] = { ...newBookmarks[index], ...updates };
        }
      });
      return newBookmarks;
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      <Sidebar 
        currentView={view} 
        onViewChange={setView} 
        staleCount={staleCount} 
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-2xl relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search links, tags, or categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 ml-8">
             <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-bold text-slate-800">Scout</p>
                <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 rounded-full">ULTRA PLAN</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                <img src="https://picsum.photos/seed/user/100" alt="User" />
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          {view === ViewMode.DASHBOARD && (
            <Dashboard 
              bookmarks={bookmarks} 
              onCleanupClick={() => setView(ViewMode.STALE)} 
            />
          )}

          {view === ViewMode.AI_ORGANIZER && (
            <AIOrganizer 
              bookmarks={bookmarks} 
              onUpdateBookmark={handleUpdate} 
              onBulkDelete={handleBulkDelete}
              onBulkUpdate={handleBulkUpdate}
            />
          )}

          {(view === ViewMode.ALL_BOOKMARKS || view === ViewMode.STALE) && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">
                    {view === ViewMode.STALE ? 'Needs Cleanup' : 'All Bookmarks'}
                  </h2>
                  <p className="text-slate-500 mt-1">
                    {view === ViewMode.STALE 
                      ? `Found ${staleCount} links that are likely outdated or forgotten.` 
                      : `Total of ${bookmarks.length} saved resources across all categories.`
                    }
                  </p>
                </div>
                {view === ViewMode.STALE && staleCount > 0 && (
                  <button 
                    onClick={() => handleBulkDelete(bookmarks.filter(b => b.isStale).map(b => b.id))}
                    className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete All Stale
                  </button>
                )}
              </div>

              {filteredBookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBookmarks.map(b => (
                    <BookmarkCard 
                      key={b.id} 
                      bookmark={b} 
                      onDelete={handleDelete} 
                      onOpen={(url) => window.open(url, '_blank')}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                  <div className="text-6xl mb-6">🏜️</div>
                  <h3 className="text-xl font-bold text-slate-800">No bookmarks found</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your search or add some new links!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
