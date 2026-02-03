
export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  addedAt: string;
  lastAccessed: string;
  favicon?: string;
  isStale: boolean;
  summary?: string;
}

export interface CategoryStats {
  name: string;
  count: number;
  color: string;
}

export enum ViewMode {
  DASHBOARD = 'dashboard',
  ALL_BOOKMARKS = 'all',
  STALE = 'stale',
  CATEGORIES = 'categories',
  AI_ORGANIZER = 'ai_organizer'
}

export interface AIAnalysisResult {
  category: string;
  tags: string[];
  summary: string;
}
