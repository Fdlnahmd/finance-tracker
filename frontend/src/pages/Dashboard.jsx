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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-realtime-card p-5 md:p-6 rounded-2xl border border-realtime-border dark:border-realtime-darkBorder shadow-sm mb-6 lg:mb-8 w-full gap-4 transition-colors">
        <div>
          <h3 className="text-lg font-extrabold text-realtime-text dark:text-realtime-darkText">Periode Laporan</h3>
          <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60">Pilih periode laporan analisis keuangan Anda</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-sm font-semibold text-realtime-text dark:text-realtime-darkText focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          >
            {monthsList.map(m => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-sm font-semibold text-realtime-text dark:text-realtime-darkText focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
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
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100/50 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-500/25 rounded-2xl p-6 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:scale-[1.005] hover:shadow-md transition-all duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-20 dark:opacity-30 pointer-events-none font-bold">💰</div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-700/80 dark:text-emerald-300/80 block mb-1">Total Pemasukan</span>
          {loading ? (
            <div className="h-9 w-40 bg-emerald-100 dark:bg-emerald-950/40 animate-pulse rounded-lg mt-2" />
          ) : (
            <h2 className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">{formatIDR(summary?.total_income)}</h2>
          )}
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-4 block font-semibold bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200/40 dark:border-emerald-500/25 py-1.5 px-3 rounded-xl w-max">
            🟢 Tertabung bulan ini
          </span>
        </div>

        {/* Total Expense Card */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-100/50 dark:from-rose-950/40 dark:to-pink-950/20 border border-rose-200/60 dark:border-rose-500/25 rounded-2xl p-6 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:scale-[1.005] hover:shadow-md transition-all duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-20 dark:opacity-30 pointer-events-none font-bold">💸</div>
          <span className="text-xs uppercase font-bold tracking-wider text-rose-700/80 dark:text-rose-300/80 block mb-1">Total Pengeluaran</span>
          {loading ? (
            <div className="h-9 w-40 bg-rose-100 dark:bg-rose-950/40 animate-pulse rounded-lg mt-2" />
          ) : (
            <h2 className="text-3xl font-black tracking-tight text-rose-600 dark:text-rose-400 mt-1">{formatIDR(summary?.total_expense)}</h2>
          )}
          <span className="text-xs text-rose-600 dark:text-rose-400 mt-4 block font-semibold bg-rose-100/50 dark:bg-rose-500/10 border border-rose-200/40 dark:border-rose-500/25 py-1.5 px-3 rounded-xl w-max">
            🔴 Terbelanjakan bulan ini
          </span>
        </div>

        {/* Net Balance Card */}
        <div className={`border rounded-2xl p-6 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:scale-[1.005] hover:shadow-md transition-all duration-200 relative overflow-hidden bg-gradient-to-br ${
          (summary?.balance || 0) >= 0
            ? 'from-primary-50 to-accent-100/50 dark:from-primary-950/30 dark:to-accent-950/20 border-primary-200/60 dark:border-primary-500/25'
            : 'from-amber-50 to-orange-100/50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200/60 dark:border-amber-500/25'
        }`}>
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-20 dark:opacity-30 pointer-events-none font-bold">📊</div>
          <span className={`text-xs uppercase font-bold tracking-wider block mb-1 ${
            (summary?.balance || 0) >= 0 ? 'text-primary-700/80 dark:text-primary-300/80' : 'text-amber-700/80 dark:text-amber-300/80'
          }`}>Sisa Saldo (Net)</span>
          {loading ? (
            <div className="h-9 w-40 bg-primary-100 dark:bg-primary-950/40 animate-pulse rounded-lg mt-2" />
          ) : (
            <h2 className={`text-3xl font-black tracking-tight mt-1 ${
              (summary?.balance || 0) >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-amber-600 dark:text-amber-400'
            }`}>{formatIDR(summary?.balance)}</h2>
          )}
          
          {(summary?.balance || 0) >= 0 ? (
            <span className="text-xs text-primary-600 dark:text-primary-400 mt-4 block font-semibold bg-primary-100/50 dark:bg-primary-500/10 border border-primary-200/40 dark:border-primary-500/25 py-1.5 px-3 rounded-xl w-max">
              ✨ Kondisi dompet aman
            </span>
          ) : (
            <span className="text-xs text-amber-600 dark:text-amber-400 mt-4 block font-semibold bg-amber-100/50 dark:bg-amber-500/10 border border-amber-200/40 dark:border-amber-500/25 py-1.5 px-3 rounded-xl w-max">
              ⚠️ Pengeluaran melebihi batas
            </span>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
        
        {/* Left Chart: Category Breakdown (Pie) */}
        <div className="bg-white dark:bg-realtime-card p-6 rounded-2xl border border-realtime-border dark:border-realtime-darkBorder shadow-sm flex flex-col transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-base font-extrabold text-realtime-text dark:text-realtime-darkText">Alokasi Kategori</h4>
              <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60">Breakdown alokasi pos keuangan</p>
            </div>
            
            {/* Toggle Tab */}
            <div className="flex bg-primary-50 dark:bg-primary-950/20 border border-primary-100/20 dark:border-primary-900/20 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('expense')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'expense'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-realtime-text/65 dark:text-realtime-darkText/65 hover:text-primary-500'
                }`}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setActiveTab('income')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'income'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-realtime-text/65 dark:text-realtime-darkText/65 hover:text-primary-500'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center relative">
            {loading ? (
              <div className="w-16 h-16 border-4 border-realtime-border dark:border-realtime-darkBorder border-t-primary-500 rounded-full animate-spin" />
            ) : pieData.length === 0 ? (
              <div className="text-center text-realtime-text/40 dark:text-realtime-darkText/40">
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
        <div className="bg-white dark:bg-realtime-card p-6 rounded-2xl border border-realtime-border dark:border-realtime-darkBorder shadow-sm flex flex-col transition-colors">
          <div className="mb-6">
            <h4 className="text-base font-extrabold text-realtime-text dark:text-realtime-darkText">Tren 6 Bulan Terakhir</h4>
            <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60">Komparasi histori pemasukan dan pengeluaran</p>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="w-full h-full bg-primary-50 dark:bg-primary-950/10 animate-pulse rounded-xl" />
            ) : trendData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-realtime-text/40 dark:text-realtime-darkText/40">
                <span className="text-4xl block mb-2">📈</span>
                <p className="text-sm font-semibold">Histori data keuangan belum tersedia</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-realtime-darkBorder/40" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#71717A' }} axisLine={false} tickLine={false} width={45} tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${v/1000}k`} />
                  <Tooltip formatter={(v) => formatIDR(v)} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Bar dataKey="Pemasukan" fill="#2f27ce" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pengeluaran" fill="#433bff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white dark:bg-realtime-card p-6 rounded-2xl border border-realtime-border dark:border-realtime-darkBorder shadow-sm w-full transition-colors">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-base font-extrabold text-realtime-text dark:text-realtime-darkText">Transaksi Terbaru</h4>
            <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60">Preview 5 transaksi pencatatan terakhir Anda</p>
          </div>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-10 text-realtime-text/40 dark:text-realtime-darkText/40 border-2 border-dashed border-realtime-border dark:border-realtime-darkBorder rounded-2xl">
            <span className="text-5xl block mb-3">📝</span>
            <h5 className="font-bold text-realtime-text/80 dark:text-realtime-darkText/80">Belum Ada Transaksi</h5>
            <p className="text-xs mt-1">Mulailah dengan mencatat pemasukan atau pengeluaran pertama Anda!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-realtime-border dark:border-realtime-darkBorder text-xs font-bold text-realtime-text/40 dark:text-realtime-darkText/40 uppercase">
                  <th className="pb-3 font-bold">Tanggal</th>
                  <th className="pb-3 font-bold">Kategori</th>
                  <th className="pb-3 font-bold">Catatan</th>
                  <th className="pb-3 font-bold text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-realtime-border/40 dark:divide-realtime-darkBorder/40 text-sm font-semibold">
                {recentTransactions.map((tx) => {
                  const cat = categories.find(c => c.id === tx.category_id);
                  return (
                    <tr key={tx.id} className="hover:bg-primary-50/10 dark:hover:bg-primary-950/5 transition-colors">
                      <td className="py-4 text-realtime-text/75 dark:text-realtime-darkText/75">
                        {new Date(tx.date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border"
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
                      <td className="py-4 text-realtime-text/60 dark:text-realtime-darkText/60 italic">
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
