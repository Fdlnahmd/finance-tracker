import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useTheme from '../../hooks/useTheme';

export default function Navbar({ onMenuToggle, title }) {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0">
      {/* Left: Mobile Menu Trigger + Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          🍔
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">{title}</h2>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* User Info & Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-sm hover:scale-105 transition-transform">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <span className="hidden md:inline text-sm font-semibold text-gray-700 dark:text-gray-200">
              {user?.name}
            </span>
          </button>

          {/* User Actions Dropdown Overlay */}
          {showUserDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserDropdown(false)}
              />
              <div className="absolute right-0 mt-2.5 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center"
                >
                  <span className="mr-2">🚪</span> Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
