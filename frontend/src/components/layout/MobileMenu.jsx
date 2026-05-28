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
      <div className="relative flex flex-col w-4/5 max-w-sm bg-white dark:bg-realtime-darkBg border-r border-realtime-border dark:border-realtime-darkBorder h-full p-6 shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 mr-2.5 object-contain" />
            <span className="font-black text-lg text-primary-500 tracking-tight">
              Finance Tracker
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-realtime-text/60 dark:text-realtime-darkText/60 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl"
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
                `flex items-center px-4 py-3 text-base font-bold rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-realtime-text/75 dark:text-realtime-darkText/75 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500'
                }`
              }
            >
              <span className="text-xl mr-4">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="border-t border-realtime-border dark:border-realtime-darkBorder pt-6 bg-white dark:bg-realtime-darkBg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-realtime-text dark:text-realtime-darkText truncate">{user?.name}</p>
              <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-150 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
          >
            🚪 Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
