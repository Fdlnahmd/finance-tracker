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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/50 p-8 md:p-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand/Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3 hover:scale-110 transition-transform cursor-pointer">💰</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Masuk Akun
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all font-semibold"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all font-semibold"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/35 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center text-base"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            Masuk
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700/50 pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Belum punya akun?{' '}
            <Link
              to="/register"
              className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
