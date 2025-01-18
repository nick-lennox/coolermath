import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Compass, Library } from 'lucide-react';

const items = [
  {
    id: 'problems',
    path: '/',
    label: 'Problems',
    icon: BookOpen
  },
  {
    id: 'explore',
    path: '/explore',
    label: 'Explore',
    icon: Compass
  },
  {
    id: 'problem-sets',
    path: '/problem-sets',
    label: 'Problem Sets',
    icon: Library
  }
];

export function Navigation() {
  return (
    <nav className="min-w-0">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 px-2">
          {items.map(({ id, path, label, icon: Icon }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex-shrink-0
                ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}