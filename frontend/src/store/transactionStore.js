import { create } from 'zustand';
import api from '../api/axios';

const useTransactionStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  filters: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: '', // 'income' | 'expense' | ''
  },

  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
    get().fetchTransactions();
  },

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    const { month, year, type } = get().filters;
    try {
      const params = { month, year };
      if (type) params.type = type;
      
      const response = await api.get('/api/transactions', { params });
      set({ transactions: response.data.data || [], loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat transaksi', loading: false });
    }
  },

  createTransaction: async (transactionInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/transactions', transactionInput);
      const newTx = response.data.data;
      
      // Re-fetch transactions to maintain sorting/filtering
      await get().fetchTransactions();
      set({ loading: false });
      return { success: true, data: newTx };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal membuat transaksi';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateTransaction: async (id, transactionInput) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/api/transactions/${id}`, transactionInput);
      await get().fetchTransactions();
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengupdate transaksi';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/transactions/${id}`);
      set({ 
        transactions: get().transactions.filter(tx => tx.id !== id),
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus transaksi';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useTransactionStore;
