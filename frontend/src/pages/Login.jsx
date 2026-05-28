import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    if (searchParams.get('expired') === 'true') {
      setSessionExpired(true);
    }
  }, [isAuthenticated, navigate, clearError, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-realtime-bg dark:bg-realtime-darkBg px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-realtime-card rounded-2xl shadow-sm border border-realtime-border dark:border-realtime-darkBorder p-8 md:p-10 animate-in zoom-in-95 duration-300">
        
        {/* Brand/Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3 hover:scale-105 transition-transform cursor-pointer">💰</span>
          <h2 className="text-2xl font-extrabold tracking-tight text-realtime-text dark:text-realtime-darkText">
            Masuk Akun
          </h2>
          <p className="mt-2 text-xs text-realtime-text/60 dark:text-realtime-darkText/60">
            Kelola pengeluaran Anda dengan premium analytics
          </p>
        </div>

        {/* Notifications / Errors */}
        {sessionExpired && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 rounded-r-xl text-xs font-semibold">
            ⚠️ Sesi Anda telah berakhir. Silakan masuk kembali.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-800 dark:text-red-300 rounded-r-xl text-xs font-semibold animate-shake">
            ❌ {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-realtime-text/75 dark:text-realtime-darkText/75 mb-1.5 uppercase tracking-wider">
              Alamat Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-realtime-text dark:text-realtime-darkText placeholder-realtime-text/40 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-realtime-text/75 dark:text-realtime-darkText/75 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-realtime-text dark:text-realtime-darkText placeholder-realtime-text/40 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center text-sm"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            Masuk
          </button>
        </form>

        <div className="mt-8 text-center border-t border-realtime-border dark:border-realtime-darkBorder pt-6">
          <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60">
            Belum punya akun?{' '}
            <Link
              to="/register"
              className="font-bold text-primary-500 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
