
import { Bookmark } from './types';

export const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: '1',
    url: 'https://react.dev',
    title: 'React Documentation',
    category: 'Development',
    tags: ['Frontend', 'JavaScript', 'Frameworks'],
    addedAt: '2023-11-15T10:00:00Z',
    lastAccessed: '2024-03-20T14:30:00Z',
    favicon: 'https://react.dev/favicon.ico',
    isStale: false,
    summary: 'The official documentation for React, the library for web and native user interfaces.'
  },
  {
    id: '2',
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - Rapidly build modern websites',
    category: 'Design',
    tags: ['CSS', 'Styling', 'UI'],
    addedAt: '2023-01-10T09:00:00Z',
    lastAccessed: '2023-02-15T11:20:00Z',
    favicon: 'https://tailwindcss.com/favicon.ico',
    isStale: true,
    summary: 'Utility-first CSS framework for rapid UI development.'
  },
  {
    id: '3',
    url: 'https://news.ycombinator.com',
    title: 'Hacker News',
    category: 'News',
    tags: ['Tech', 'Startups', 'Community'],
    addedAt: '2023-05-20T08:00:00Z',
    lastAccessed: '2024-05-18T16:45:00Z',
    favicon: 'https://news.ycombinator.com/favicon.ico',
    isStale: false,
    summary: 'A social news website focusing on computer science and entrepreneurship.'
  },
  {
    id: '4',
    url: 'https://www.figma.com',
    title: 'Figma: The Collaborative Design Tool',
    category: 'Design',
    tags: ['UI/UX', 'Collaborative', 'Prototyping'],
    addedAt: '2022-12-01T15:00:00Z',
    lastAccessed: '2023-10-10T12:00:00Z',
    favicon: 'https://www.figma.com/favicon.ico',
    isStale: true,
    summary: 'Cloud-based design and prototyping tool for digital products.'
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Development': 'bg-blue-100 text-blue-700',
  'Design': 'bg-purple-100 text-purple-700',
  'News': 'bg-orange-100 text-orange-700',
  'Uncategorized': 'bg-slate-100 text-slate-700',
  'Reference': 'bg-green-100 text-green-700'
};
