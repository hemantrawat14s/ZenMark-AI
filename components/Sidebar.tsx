
import React from 'react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  staleCount: number;
  categories: { name: string; count: number }[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  staleCount, 
  categories, 
  selectedCategory, 
  onCategorySelect 
}) => {
  const menuItems = [
    { id: ViewMode.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: ViewMode.ALL_BOOKMARKS, label: 'All Bookmarks', icon: '🔖' },
    { id: ViewMode.STALE, label: 'Needs Cleanup', icon: '🧹', badge: staleCount },
    { id: ViewMode.AI_ORGANIZER, label: 'AI Organizer', icon: '✨' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white h-screen fixed md:relative z-20 transition-transform transform md:translate-x-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
          B
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          bukmarks AI
        </h1>
      </div>

      <nav className="mt-6 px-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onViewChange(item.id);
              if (item.id !== ViewMode.ALL_BOOKMARKS) onCategorySelect(null);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
              currentView === item.id && !selectedCategory
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold text-sm">{item.label}</span>
            </div>
            {item.badge ? (
              <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}

        <div className="pt-8 pb-4">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Categories</p>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  onCategorySelect(cat.name);
                  onViewChange(ViewMode.ALL_BOOKMARKS);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <span className="truncate pr-2 font-medium">{cat.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  selectedCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl">
          <p className="text-[10px] font-black opacity-80 mb-1 uppercase tracking-widest">Active Scan</p>
          <p className="text-xs font-bold mb-3 leading-tight">Cleanup AI is running</p>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-3/4 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;