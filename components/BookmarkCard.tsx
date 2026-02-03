
import React from 'react';
import { Bookmark } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onOpen: (url: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onDelete, onOpen }) => {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return 'Today';
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div className={`group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${bookmark.isStale ? 'ring-1 ring-orange-200 bg-orange-50/20' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 p-2 overflow-hidden">
            {bookmark.favicon ? (
              <img src={bookmark.favicon} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xl">🌐</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {bookmark.title}
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[150px]">{new URL(bookmark.url).hostname}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onOpen(bookmark.url)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600"
            title="Open"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </button>
          <button 
            onClick={() => onDelete(bookmark.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {bookmark.summary && (
          <p className="text-sm text-slate-600 line-clamp-2 italic">"{bookmark.summary}"</p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${CATEGORY_COLORS[bookmark.category] || CATEGORY_COLORS['Uncategorized']}`}>
            {bookmark.category}
          </span>
          {bookmark.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Added {timeAgo(bookmark.addedAt)}
        </div>
        <div className="flex items-center gap-1.5">
          Accessed {timeAgo(bookmark.lastAccessed)}
        </div>
      </div>

      {bookmark.isStale && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
          STALE
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;
