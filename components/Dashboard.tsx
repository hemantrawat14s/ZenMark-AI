
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Bookmark, CategoryStats } from '../types';

interface DashboardProps {
  bookmarks: Bookmark[];
  onCleanupClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookmarks, onCleanupClick }) => {
  const staleCount = bookmarks.filter(b => b.isStale).length;
  
  const categoryData = bookmarks.reduce((acc: CategoryStats[], b) => {
    const existing = acc.find(item => item.name === b.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: b.category, count: 1, color: '#6366f1' });
    }
    return acc;
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Welcome back, Scout</h2>
          <p className="text-slate-500">Your digital library is looking sharp today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Sync Browser
          </button>
          <button 
            onClick={onCleanupClick}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Smart Cleanup
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Bookmarks</p>
          <h3 className="text-4xl font-bold text-slate-800">{bookmarks.length}</h3>
          <p className="text-emerald-500 text-xs mt-2 font-semibold">↑ 12% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Stale Links</p>
          <h3 className="text-4xl font-bold text-slate-800">{staleCount}</h3>
          <p className="text-orange-500 text-xs mt-2 font-semibold">{Math.round((staleCount/bookmarks.length)*100)}% of your library</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Weekly Reads</p>
          <h3 className="text-4xl font-bold text-slate-800">42</h3>
          <p className="text-slate-400 text-xs mt-2 font-semibold">Daily streak: 5 days</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">AI Savings</p>
          <h3 className="text-4xl font-bold text-slate-800">1.2h</h3>
          <p className="text-indigo-500 text-xs mt-2 font-semibold">Time saved in sorting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Category Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Activity Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-3xl font-bold mb-4">Did you know?</h3>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
            Users who clean up their bookmarks monthly find their saved resources <span className="text-white font-bold underline underline-offset-4">3x faster</span>. 
            Gemini has identified 4 bookmarks you haven't opened in over 6 months.
          </p>
          <button onClick={onCleanupClick} className="px-8 py-3 bg-white text-indigo-900 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl">
            Start Cleanup Session
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-48 h-48 bg-violet-500/20 rounded-full translate-y-1/2 blur-3xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
