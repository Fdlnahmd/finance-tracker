import { create } from 'zustand';
import api from '../api/axios';

const useSummaryStore = create((set, get) => ({
  summary: null,
  trend: [],
  loading: false,
  error: null,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),

  setPeriod: (month, year) => {
    set({ selectedMonth: month, selectedYear: year });
    get().fetchSummary();
  },

  fetchSummary: async () => {
    set({ loading: true, error: null });
    const month = get().selectedMonth;
    const year = get().selectedYear;
    try {
      const response = await api.get('/api/summary', { params: { month, year } });
      set({ summary: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat ringkasan analisis', loading: false });
    }
  },

  fetchTrend: async (months = 6) => {
    try {
      const response = await api.get('/api/summary/trend', { params: { months } });
      set({ trend: response.data.data || [] });
    } catch (error) {
      console.error('Error fetching trend:', error);
    }
  }
}));

export default useSummaryStore;
