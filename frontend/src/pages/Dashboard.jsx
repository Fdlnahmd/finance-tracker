import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import PageLayout from '../components/layout/PageLayout';
import useSummaryStore from '../store/summaryStore';
import useTransactionStore from '../store/transactionStore';
import useCategoryStore from '../store/categoryStore';
import useNotification from '../hooks/useNotification';

export default function Dashboard() {
  const { summary, trend, loading, selectedMonth, selectedYear, setPeriod, fetchSummary, fetchTrend } = useSummaryStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { requestPermission } = useNotification();

  const [activeTab, setActiveTab] = useState('expense'); // 'income' | 'expense' for pie chart

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
    fetchSummary();
    fetchTrend(6);
    fetchTransactions();
    fetchCategories();
    requestPermission(); // request browser notifications permission
  }, [fetchSummary, fetchTrend, fetchTransactions, fetchCategories, requestPermission]);

  const handleMonthChange = (e) => {
    setPeriod(parseInt(e.target.value), selectedYear);
  };

  const handleYearChange = (e) => {
    setPeriod(selectedMonth, parseInt(e.target.value));
  };

  // Format currency helpers
  const formatIDR = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val || 0);
  };

  // Filter breakdown based on selected type tab
  const pieData = (summary?.breakdown_by_category || [])
    .filter(cat => cat.type === activeTab)
    .map(cat => ({
      name: `${cat.icon} ${cat.name}`,
      value: cat.total,
      color: cat.color
    }));

  // Recharts trend data formatting
  const trendData = trend.map(item => ({
    name: monthsList.find(m => m.value === item.month)?.name.substring(0, 3) + ' ' + String(item.year).substring(2),
    Pemasukan: item.total_income,
    Pengeluaran: item.total_expense
  }));

  // Get last 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <PageLayout title="Dashboard Analisis">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm mb-6 lg:mb-8 w-full gap-4 transition-colors">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Periode Laporan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pilih periode laporan analisis keuangan Anda</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            {monthsList.map(m => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:bg-white text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            {yearsList.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 lg:mb-8">
        {/* Total Income Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-750 text-white rounded-3xl p-6 shadow-lg shadow-emerald-500/20 hover:scale-101 hover:shadow-emerald-500/30 transition-all duration-200">
          <div className="absolute top-0 right-0 p-8 text-8xl text-emerald-400/20 pointer-events-none font-bold">💰</div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-100 block mb-1">Total Pemasukan</span>
          {loading ? (
            <div className="h-9 w-40 bg-white/20 animate-pulse rounded-lg mt-2" />
          ) : (
            <h2 className="text-3xl font-black tracking-tight">{formatIDR(summary?.total_income)}</h2>
          )}
          <span className="text-xs text-emerald-100 mt-4 block font-semibold bg-emerald-400/20 py-1.5 px-3 rounded-xl w-max">
            🟢 Tertabung bulan ini
          </span>
        </div>

        {/* Total Expense Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-750 text-white rounded-3xl p-6 shadow-lg shadow-rose-500/20 hover:scale-101 hover:shadow-rose-500/30 transition-all duration-200">
          <div className="absolute top-0 right-0 p-8 text-8xl text-rose-400/20 pointer-events-none font-bold">💸</div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-rose-100 block mb-1">Total Pengeluaran</span>
          {loading ? (
            <div className="h-9 w-40 bg-white/20 animate-pulse rounded-lg mt-2" />
          ) : (
            <h2 className="text-3xl font-black tracking-tight">{formatIDR(summary?.total_expense)}</h2>
          )}
          <span className="text-xs text-rose-100 mt-4 block font-semibold bg-rose-400/20 py-1.5 px-3 rounded-xl w-max">
            🔴 Terbelanjakan bulan ini
          </span>
        </div>

        {/* Net Balance Card */}
        <div className={`relative overflow-hidden text-white rounded-3xl p-6 shadow-lg hover:scale-101 transition-all duration-200 ${
          (summary?.balance || 0) >= 0
            ? 'bg-gradient-to-br from-sky-500 to-indigo-600 dark:from-sky-600 dark:to-indigo-750 shadow-sky-500/20'
            : 'bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-750 shadow-amber-500/20'
        }`}>
          <div className="absolute top-0 right-0 p-8 text-8xl text-white/10 pointer-events-none font-bold">📊</div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-white/80 block mb-1">Sisa Saldo (Net)</span>
          {loading ? (
            <div className="h-9 w-40 bg-white/20 animate-pulse rounded-lg mt-2" />
          ) : (
            <h2 className="text-3xl font-black tracking-tight">{formatIDR(summary?.balance)}</h2>
          )}
          <span className="text-xs text-white/90 mt-4 block font-semibold bg-white/15 py-1.5 px-3 rounded-xl w-max">
            {(summary?.balance || 0) >= 0 ? '✨ Kondisi dompet aman' : '⚠️ Pengeluaran melebihi batas'}
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
        
        {/* Left Chart: Category Breakdown (Pie) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white">Alokasi Kategori</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Breakdown alokasi pos keuangan</p>
            </div>
            
            {/* Toggle Tab */}
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('expense')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'expense'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setActiveTab('income')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'income'
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center relative">
            {loading ? (
              <div className="w-48 h-48 border-4 border-gray-100 dark:border-gray-700 border-t-sky-500 rounded-full animate-spin" />
            ) : pieData.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500">
                <span className="text-4xl block mb-2">🤷‍♂️</span>
                <p className="text-sm font-semibold">Tidak ada data untuk diagram ini</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatIDR(value)} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Chart: Income vs Expense Trend (Bar) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col transition-colors">
          <div className="mb-6">
            <h4 className="text-base font-extrabold text-gray-900 dark:text-white">Tren 6 Bulan Terakhir</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Komparasi histori pemasukan dan pengeluaran</p>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="w-full h-full bg-gray-50 dark:bg-gray-900 animate-pulse rounded-2xl" />
            ) : trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-gray-400">
                <span className="text-4xl block mb-2">📈</span>
                <p className="text-sm font-semibold">Histori data keuangan belum tersedia</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={45} tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${v/1000}k`} />
                  <Tooltip formatter={(v) => formatIDR(v)} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Bar dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pengeluaran" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm w-full transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-base font-extrabold text-gray-900 dark:text-white">Transaksi Terbaru</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Preview 5 transaksi pencatatan terakhir Anda</p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl">
            <span className="text-5xl block mb-3">📝</span>
            <h5 className="font-bold text-gray-600 dark:text-gray-300">Belum Ada Transaksi</h5>
            <p className="text-xs mt-1">Mulailah dengan mencatat pemasukan atau pengeluaran pertama Anda!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                  <th className="pb-3 font-extrabold">Tanggal</th>
                  <th className="pb-3 font-extrabold">Kategori</th>
                  <th className="pb-3 font-extrabold">Catatan</th>
                  <th className="pb-3 font-extrabold text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/30 text-sm font-semibold">
                {recentTransactions.map((tx) => {
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
