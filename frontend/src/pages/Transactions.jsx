import React, { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import useTransactionStore from '../store/transactionStore';
import useCategoryStore from '../store/categoryStore';

export default function Transactions() {
  const { transactions, filters, setFilters, loading, createTransaction, updateTransaction, deleteTransaction, fetchTransactions } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();

  // Hitung total saldo, pemasukan, dan pengeluaran secara real-time
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netBalance = totalIncome - totalExpense;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  // Form State
  const [categoryID, setCategoryID] = useState('');
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [formError, setFormError] = useState('');

  const monthsList = [
    { value: 1, name: 'Januari' },
    { value: 2, name: 'Februari' },
    { value: 3, name: 'Maret' },
    { value: 4, name: 'April' },
    { value: 5, name: 'Mei' },
    { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' },
    { value: 8, name: 'Agustus' },
    { value: 9, name: 'September' },
    { value: 10, name: 'Oktober' },
    { value: 11, name: 'November' },
    { value: 12, name: 'Desember' }
  ];

  const currentYear = new Date().getFullYear();
  const yearsList = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingTx(null);
    setCategoryID(categories.find(c => c.type === 'expense')?.id || '');
    setType('expense');
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().substring(0, 10));
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (tx) => {
    setEditingTx(tx);
    setCategoryID(tx.category_id);
    setType(tx.type);
    setAmount(tx.amount);
    setNote(tx.note || '');
    setDate(tx.date.substring(0, 10));
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Type Change inside Form
  const handleTypeChange = (newType) => {
    setType(newType);
    // Auto-select first matching category
    const match = categories.find(c => c.type === newType);
    setCategoryID(match ? match.id : '');
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!amount || parseFloat(amount) <= 0) {
      setFormError('Nominal harus lebih besar dari 0');
      return;
    }
    if (!categoryID) {
      setFormError('Silakan pilih kategori');
      return;
    }

    const payload = {
      category_id: categoryID,
      type,
      amount: parseFloat(amount),
      note,
      date
    };

    let result;
    if (editingTx) {
      result = await updateTransaction(editingTx.id, payload);
    } else {
      result = await createTransaction(payload);
    }

    if (result.success) {
      setIsModalOpen(false);
    } else {
      setFormError(result.message || 'Gagal menyimpan transaksi');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      await deleteTransaction(id);
    }
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  const activeCategories = categories.filter(c => c.type === type);

  return (
    <PageLayout title="Pencatatan Keuangan">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm mb-6 lg:mb-8 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 transition-colors">
        
        {/* Period & Type Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.month}
            onChange={(e) => setFilters({ month: parseInt(e.target.value) })}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            {monthsList.map(m => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>
          
          <select
            value={filters.year}
            onChange={(e) => setFilters({ year: parseInt(e.target.value) })}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            {yearsList.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ type: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="">Semua Transaksi</option>
            <option value="income">Pemasukan (Income)</option>
            <option value="expense">Pengeluaran (Expense)</option>
          </select>
        </div>

        {/* Add Record Trigger */}
        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 flex items-center justify-center text-sm active:scale-98 transition-all duration-150"
        >
          ➕ Catat Transaksi
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        {/* Total Saldo Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-gray-400 dark:text-gray-550 uppercase tracking-wider">Total Saldo (Netto)</span>
            <span className="text-lg">💰</span>
          </div>
          <h3 className={`text-2xl font-black ${netBalance >= 0 ? 'text-sky-500' : 'text-rose-500'}`}>
            {netBalance >= 0 ? '' : '-'} {formatIDR(Math.abs(netBalance)).replace('Rp', 'Rp ')}
          </h3>
        </div>

        {/* Total Pemasukan Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-gray-400 dark:text-gray-550 uppercase tracking-wider">Total Pemasukan</span>
            <span className="text-lg">📈</span>
          </div>
          <h3 className="text-2xl font-black text-emerald-500">
            + {formatIDR(totalIncome).replace('Rp', 'Rp ')}
          </h3>
        </div>

        {/* Total Pengeluaran Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-gray-400 dark:text-gray-550 uppercase tracking-wider">Total Pengeluaran</span>
            <span className="text-lg">📉</span>
          </div>
          <h3 className="text-2xl font-black text-rose-500">
            - {formatIDR(totalExpense).replace('Rp', 'Rp ')}
          </h3>
        </div>
      </div>

      {/* Transaction Records Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm p-6 transition-colors">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-12 h-12 border-4 border-gray-100 dark:border-gray-700 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-400 font-bold">Memuat daftar keuangan...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
            <span className="text-6xl block mb-4">📝</span>
            <h4 className="font-extrabold text-gray-700 dark:text-gray-300 text-base">Tidak Ada Catatan</h4>
            <p className="text-xs mt-1.5 leading-relaxed">
              Belum ada transaksi tercatat pada periode ini. Klik "Catat Transaksi" untuk mulai mengelola keuangan Anda.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                    <th className="pb-3.5 font-extrabold">Tanggal</th>
                    <th className="pb-3.5 font-extrabold">Kategori</th>
                    <th className="pb-3.5 font-extrabold">Catatan</th>
                    <th className="pb-3.5 font-extrabold text-right">Nominal</th>
                    <th className="pb-3.5 font-extrabold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-750/30 text-sm font-semibold">
                  {transactions.map((tx) => {
                    const cat = categories.find(c => c.id === tx.category_id);
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors">
                        <td className="py-4 text-gray-600 dark:text-gray-300">
                          {new Date(tx.date).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="py-4">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border"
                            style={{
                              backgroundColor: (cat?.color || '#9CA3AF') + '15',
                              borderColor: cat?.color || '#9CA3AF',
                              color: cat?.color || '#9CA3AF'
                            }}
                          >
                            <span className="mr-1.5">{cat?.icon || '📦'}</span>
                            {cat?.name || 'Lainnya'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500 dark:text-gray-400 italic">
                          {tx.note || '-'}
                        </td>
                        <td className={`py-4 text-right font-black ${
                          tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                          {tx.type === 'income' ? '+' : '-'} {formatIDR(tx.amount).replace('Rp', 'Rp ')}
                        </td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center space-x-2.5">
                            <button
                              onClick={() => handleOpenEdit(tx)}
                              className="p-2 rounded-xl text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 transition-colors"
                              title="Ubah"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                              title="Hapus"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-4">
              {transactions.map((tx) => {
                const cat = categories.find(c => c.id === tx.category_id);
                return (
                  <div
                    key={tx.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-150/40 dark:border-gray-700/50 flex flex-col space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {new Date(tx.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: (cat?.color || '#9CA3AF') + '15',
                          borderColor: cat?.color || '#9CA3AF',
                          color: cat?.color || '#9CA3AF'
                        }}
                      >
                        <span className="mr-1">{cat?.icon || '📦'}</span>
                        {cat?.name || 'Lainnya'}
                      </span>
                    </div>
                    
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 italic truncate">
                      {tx.note || 'Tidak ada catatan'}
                    </p>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-150/30 dark:border-gray-750/30">
                      <h4 className={`text-base font-black ${
                        tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'} {formatIDR(tx.amount).replace('Rp', 'Rp ')}
                      </h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="px-2 py-1.5 rounded-lg text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/20 dark:text-sky-400"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="px-2 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Slide-up/Centered Form Modal */}
      {isModalOpen && (
        <>
          {/* Overlay mask */}
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] md:max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {editingTx ? '✏️ Edit Transaksi' : '➕ Catat Transaksi'}
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
                    onClick={() => handleTypeChange('expense')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      type === 'expense'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('income')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      type === 'income'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Pemasukan
                  </button>
                </div>
              </div>

              {/* Amount Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Nominal (Rupiah)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-bold"
                  placeholder="Contoh: 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* Category Dropdown Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Kategori
                </label>
                <select
                  required
                  value={categoryID}
                  onChange={(e) => setCategoryID(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="" disabled>Pilih Kategori</option>
                  {activeCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Note input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Catatan (Opsional)
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                  placeholder="Catatan belanja makan siang, tagihan bulanan..."
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold shadow-lg shadow-sky-500/25 active:scale-98 transition-all text-sm flex items-center justify-center"
              >
                💾 Simpan Catatan
              </button>
            </form>
          </div>
        </>
      )}
    </PageLayout>
  );
}
