import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [valError, setValError] = useState('');
  const { register, loading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValError('');
    
    if (password.length < 8) {
      setValError('Password minimal harus 8 karakter');
      return;
    }

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/50 p-8 md:p-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3 hover:scale-110 transition-transform cursor-pointer">💰</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Dapatkan kategori default lengkap langsung saat registrasi!
          </p>
        </div>

        {/* Errors Display */}
        {(valError || error) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-800 dark:text-red-300 rounded-r-xl text-xs font-semibold animate-shake">
            ❌ {valError || error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all font-semibold"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              Password (Min. 8 Karakter)
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-900 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all font-semibold"
              placeholder="Masukkan minimal 8 karakter"
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
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-700/50 pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Masuk Saja
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
