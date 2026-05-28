import React, { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import useCategoryStore from '../store/categoryStore';

export default function Categories() {
  const { categories, fetchCategories, loading, createCategory, updateCategory, deleteCategory } = useCategoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [icon, setIcon] = useState('🍔');
  const [color, setColor] = useState('#EF4444');
  const [formError, setFormError] = useState('');

  const emojiList = ['🍔', '🏠', '🚗', '🎮', '🩺', '🎓', '🛍️', '💼', '💰', '📈', '🎁', '📦', '✈️', '🍿', '💡', '🏋️', '🔌', '☕'];
  
  const colorList = [
    { name: 'Red', hex: '#EF4444' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Amber', hex: '#F59E0B' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Green', hex: '#22C55E' },
    { name: 'Teal', hex: '#14B8A6' },
    { name: 'Sky', hex: '#0EA5E9' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Indigo', hex: '#6366F1' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Gray', hex: '#6B7280' }
  ];

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setType('expense');
    setIcon('🍔');
    setColor('#EF4444');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setType(cat.type);
    setIcon(cat.icon);
    setColor(cat.color);
    setFormError('');
    setIsModalOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Nama kategori wajib diisi');
      return;
    }

    const payload = { name, type, icon, color };

    let result;
    if (editingCat) {
      result = await updateCategory(editingCat.id, payload);
    } else {
      result = await createCategory(payload);
    }

    if (result.success) {
      setIsModalOpen(false);
    } else {
      setFormError(result.message || 'Gagal menyimpan kategori');
    }
  };

  // Handle Delete
  const handleDelete = async (cat) => {
    if (cat.is_default) {
      alert('Kategori bawaan (default) tidak dapat dihapus');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${cat.name}"?\nCatatan: Kategori tidak dapat dihapus jika masih digunakan oleh transaksi.`)) {
      const result = await deleteCategory(cat.id);
      if (!result.success) {
        alert(result.message || 'Gagal menghapus kategori');
      }
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <PageLayout title="Manajemen Kategori">
      {/* Top Banner and Add Action */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Kustom Kategori</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Atur emoji, nama, dan warna alokasi kategori Anda</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold shadow-lg shadow-sky-500/20 flex items-center justify-center text-sm active:scale-98 transition-all w-full sm:w-auto"
        >
          ➕ Kategori Baru
        </button>
      </div>

      {loading && categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-12 h-12 border-4 border-gray-100 dark:border-gray-700 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-bold">Memuat daftar kategori...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Expense Categories */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-gray-150 dark:border-gray-700">
              <span className="text-xl">🔴</span>
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white">Kategori Pengeluaran ({expenseCategories.length})</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between hover:scale-101 hover:shadow-md transition-all duration-150"
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm"
                      style={{ backgroundColor: cat.color + '15', border: `1.5px solid ${cat.color}` }}
                    >
                      {cat.icon || '📦'}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-white flex items-center">
                        {cat.name}
                        {cat.is_default && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-400">
                            Bawaan
                          </span>
                        )}
                      </h5>
                    </div>
                  </div>

                  {!cat.is_default && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg text-xs font-bold text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Income Categories */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 pb-2 border-b border-gray-150 dark:border-gray-700">
              <span className="text-xl">🟢</span>
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white">Kategori Pemasukan ({incomeCategories.length})</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex items-center justify-between hover:scale-101 hover:shadow-md transition-all duration-150"
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm"
                      style={{ backgroundColor: cat.color + '15', border: `1.5px solid ${cat.color}` }}
                    >
                      {cat.icon || '📦'}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 dark:text-white flex items-center">
                        {cat.name}
                        {cat.is_default && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-400">
                            Bawaan
                          </span>
                        )}
                      </h5>
                    </div>
                  </div>

                  {!cat.is_default && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg text-xs font-bold text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Category Creation / Update Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] md:max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {editingCat ? '✏️ Edit Kategori' : '➕ Kategori Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                ❌
              </button>
            </div>

            {formError && (
              <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 text-red-800 dark:text-red-300 rounded-r-xl text-xs font-bold">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Type Switcher Tab */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Tipe Transaksi
                </label>
                <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                  <button
                    type="button"
                    disabled={!!editingCat}
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      type === 'expense'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    } disabled:opacity-50`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    disabled={!!editingCat}
                    onClick={() => setType('income')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      type === 'income'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    } disabled:opacity-50`}
                  >
                    Pemasukan
                  </button>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  maxLength="25"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-bold"
                  placeholder="Contoh: Transportasi, Investasi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Emoji Icon Grid Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Pilih Emoji ({icon})
                </label>
                <div className="grid grid-cols-6 gap-2 bg-gray-55 dark:bg-gray-900 p-3 rounded-2xl max-h-[140px] overflow-y-auto border border-gray-100 dark:border-gray-700">
                  {emojiList.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setIcon(em)}
                      className={`text-2xl p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all ${
                        icon === em ? 'bg-sky-500/25 border-2 border-sky-500 scale-105' : ''
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Grid Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Pilih Warna Aset
                </label>
                <div className="grid grid-cols-7 gap-3 bg-gray-55 dark:bg-gray-900 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700">
                  {colorList.map(col => (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setColor(col.hex)}
                      className={`w-7 h-7 rounded-full transition-all focus:outline-none ${
                        color === col.hex ? 'ring-4 ring-sky-500/35 border-2 border-white dark:border-gray-800 scale-105' : ''
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold shadow-lg shadow-sky-500/25 active:scale-98 transition-all text-sm flex items-center justify-center"
              >
                💾 Simpan Kategori
              </button>
            </form>
          </div>
        </>
      )}
    </PageLayout>
  );
}
