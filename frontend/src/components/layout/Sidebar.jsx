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
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-realtime-darkBg border-r border-realtime-border dark:border-realtime-darkBorder h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg">
        <img src="/logo.png" alt="Logo" className="w-7 h-7 mr-2.5 object-contain" />
        <span className="font-black text-lg text-primary-500 tracking-tight">
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
              `flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors duration-150 ${
                isActive
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-realtime-text/75 dark:text-realtime-darkText/75 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500 dark:hover:text-primary-200'
              }`
            }
          >
            <span className="text-lg mr-3.5">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Section / Footer */}
      <div className="p-4 border-t border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg">
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
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-150 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors duration-150"
        >
          🚪 Keluar
        </button>
      </div>
    </aside>
  );
}
