import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function MobileMenu({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/transactions', label: 'Transaksi', icon: '💸' },
    { to: '/categories', label: 'Kategori', icon: '🏷️' },
    { to: '/reminders', label: 'Pengingat', icon: '🔔' }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Dark Overlay Background */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Menu Drawer */}
      <div className="relative flex flex-col w-4/5 max-w-sm bg-white dark:bg-gray-800 h-full p-6 shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 mr-2.5 object-contain" />
            <span className="font-extrabold text-lg bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Finance Tracker
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
          >
            ❌
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 text-base font-bold rounded-xl transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <span className="text-xl mr-4">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="border-t border-gray-150 dark:border-gray-700 pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-xl transition-colors"
          >
            🚪 Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
