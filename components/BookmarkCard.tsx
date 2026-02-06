
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

  const staleStyles = "border-amber-200 bg-amber-50/40 shadow-sm shadow-amber-100/50";
  const defaultStyles = "bg-white border-slate-200";

  return (
    <div className={`group relative border rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${bookmark.isStale ? staleStyles : defaultStyles}`}>
      {/* Visual Accent for Stale Items */}
      {bookmark.isStale && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border p-2 overflow-hidden transition-colors ${bookmark.isStale ? 'bg-white border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
            {bookmark.favicon ? (
              <img src={bookmark.favicon} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xl">🌐</span>
            )}
          </div>
          <div>
            <h3 className={`font-semibold leading-snug line-clamp-1 transition-colors ${bookmark.isStale ? 'text-amber-900 group-hover:text-amber-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>
              {bookmark.title}
            </h3>
            <p className={`text-xs truncate max-w-[150px] ${bookmark.isStale ? 'text-amber-600/60' : 'text-slate-400'}`}>
              {new URL(bookmark.url).hostname}
            </p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onOpen(bookmark.url)}
            className={`p-1.5 rounded-lg transition-colors ${bookmark.isStale ? 'hover:bg-amber-100 text-amber-500 hover:text-amber-700' : 'hover:bg-slate-100 text-slate-400 hover:text-indigo-600'}`}
            title="Open"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </button>
          <button 
            onClick={() => onDelete(bookmark.id)}
            className={`p-1.5 rounded-lg transition-colors ${bookmark.isStale ? 'hover:bg-red-100 text-amber-500 hover:text-red-600' : 'hover:bg-red-50 text-slate-400 hover:text-red-600'}`}
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {bookmark.summary && (
          <p className={`text-sm line-clamp-2 italic ${bookmark.isStale ? 'text-amber-700/70' : 'text-slate-600'}`}>
            "{bookmark.summary}"
          </p>
        )}
        
        <div className="flex flex-wrap gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${bookmark.isStale ? 'bg-amber-200 text-amber-800' : (CATEGORY_COLORS[bookmark.category] || CATEGORY_COLORS['Uncategorized'])}`}>
            {bookmark.category}
          </span>
          {bookmark.tags.map(tag => (
            <span key={tag} className={`text-[10px] px-2 py-0.5 rounded font-medium ${bookmark.isStale ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className={`mt-5 pt-4 border-t flex items-center justify-between text-[11px] ${bookmark.isStale ? 'border-amber-200/50 text-amber-500' : 'border-slate-100 text-slate-400'}`}>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Added {timeAgo(bookmark.addedAt)}
        </div>
        <div className="flex items-center gap-1.5">
          Accessed {timeAgo(bookmark.lastAccessed)}
        </div>
      </div>

      {bookmark.isStale && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm tracking-tighter uppercase">
          STALE
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;
