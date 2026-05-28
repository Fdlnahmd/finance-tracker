import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

export default function NotFound() {
  const navigate = useNavigate();
  useTheme(); // Ensure dark mode adapts perfectly on initial standalone mount

  return (
    <div className="min-h-screen bg-realtime-bg dark:bg-realtime-darkBg flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 dark:bg-accent-500/15 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Main Content Card */}
      <div className="max-w-md w-full text-center z-10 space-y-8 px-6">
        
        {/* Animated Neon 404 Badge */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary-500/15 dark:bg-primary-500/25 rounded-3xl blur-2xl scale-95 animate-pulse" />
          <div className="relative bg-white/70 dark:bg-realtime-card/80 backdrop-blur-md border border-realtime-border dark:border-realtime-darkBorder py-8 px-12 rounded-3xl shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col items-center justify-center">
            <h1 className="text-8xl font-black tracking-widest bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent select-none drop-shadow-[0_4px_10px_rgba(47,39,206,0.15)] dark:drop-shadow-[0_4px_20px_rgba(67,59,255,0.4)] animate-bounce duration-1000">
              404
            </h1>
            <div className="h-1.5 w-16 bg-accent-500 dark:bg-accent-400 rounded-full mt-4 animate-pulse" />
          </div>
        </div>

        {/* Witty Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-realtime-text dark:text-realtime-darkText">
            Halaman Ga Ada Wok!
          </h2>
          <p className="text-sm text-realtime-text/60 dark:text-realtime-darkText/60 leading-relaxed max-w-sm mx-auto font-semibold">
            Sepertinya halaman yang Anda cari telah "dilikuidasi" atau tidak pernah ada dalam anggaran kami. Mari kembali ke jalur keuangan yang aman!
          </p>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-transparent border border-realtime-border dark:border-realtime-darkBorder text-realtime-text dark:text-realtime-darkText font-semibold hover:bg-primary-50 dark:hover:bg-primary-950/10 hover:text-primary-500 dark:hover:text-primary-400 active:scale-[0.98] transition-all text-sm"
          >
            ← Kembali
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-sm active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2"
          >
            🏠 Dashboard Utama
          </button>
        </div>

      </div>

      {/* Subtle Footer Watermark */}
      <span className="absolute bottom-6 text-[10px] font-bold text-realtime-text/25 dark:text-realtime-darkText/20 uppercase tracking-widest">
        Finance Tracker • 
      </span>
    </div>
  );
}
