import { useEffect } from 'react';
import { create } from 'zustand';

// Light/Dark Theme Store
export const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  
  toggleTheme: () => set((state) => {
    const nextDark = !state.isDark;
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    return { isDark: nextDark };
  })
}));

export default function useTheme() {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark, toggleTheme };
}
