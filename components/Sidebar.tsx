
import React from 'react';
import { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  staleCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, staleCount }) => {
  const menuItems = [
    { id: ViewMode.DASHBOARD, label: 'Dashboard', icon: '📊' },
    { id: ViewMode.ALL_BOOKMARKS, label: 'All Bookmarks', icon: '🔖' },
    { id: ViewMode.STALE, label: 'Needs Cleanup', icon: '🧹', badge: staleCount },
    { id: ViewMode.AI_ORGANIZER, label: 'AI Organizer', icon: '✨' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white h-screen fixed md:relative z-20 transition-transform transform md:translate-x-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
          Z
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          ZenMark AI
        </h1>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge ? (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-8 left-4 right-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl">
        <p className="text-xs opacity-80 mb-1">PRO FEATURES</p>
        <p className="text-sm font-semibold mb-3 leading-tight">Automated Weekly Cleanup active</p>
        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white w-3/4 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
