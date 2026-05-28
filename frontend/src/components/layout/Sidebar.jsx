import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/transactions', label: 'Transaksi', icon: '💸' },
    { to: '/categories', label: 'Kategori', icon: '🏷️' },
    { to: '/reminders', label: 'Pengingat', icon: '🔔' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-white dark:from-gray-800 dark:to-gray-800">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2.5 object-contain" />
        <span className="font-extrabold text-lg bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
          Finance Tracker
        </span>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <span className="text-lg mr-3.5">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Section / Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl transition-colors duration-150"
        >
          🚪 Keluar
        </button>
      </div>
    </aside>
  );
}
