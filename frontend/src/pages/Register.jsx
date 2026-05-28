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
    <div className="min-h-screen flex items-center justify-center bg-realtime-bg dark:bg-realtime-darkBg px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-realtime-card rounded-2xl shadow-sm border border-realtime-border dark:border-realtime-darkBorder p-8 md:p-10 animate-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3 hover:scale-105 transition-transform cursor-pointer">💰</span>
          <h2 className="text-2xl font-extrabold tracking-tight text-realtime-text dark:text-realtime-darkText">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-xs text-realtime-text/60 dark:text-realtime-darkText/60">
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
            <label className="block text-xs font-bold text-realtime-text/75 dark:text-realtime-darkText/75 mb-1.5 uppercase tracking-wider">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-realtime-text dark:text-realtime-darkText placeholder-realtime-text/40 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
              placeholder="Nama Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              Password (Min. 8 Karakter)
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-realtime-text dark:text-realtime-darkText placeholder-realtime-text/40 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-sm"
              placeholder="Masukkan minimal 8 karakter"
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
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-8 text-center border-t border-realtime-border dark:border-realtime-darkBorder pt-6">
          <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="font-bold text-primary-500 hover:underline"
            >
              Masuk Saja
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
