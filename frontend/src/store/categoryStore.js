import { create } from 'zustand';
import api from '../api/axios';

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/categories');
      set({ categories: response.data.data || [], loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat kategori', loading: false });
    }
  },

  createCategory: async (categoryInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/categories', categoryInput);
      const newCategory = response.data.data;
      set({ 
        categories: [...get().categories, newCategory],
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal membuat kategori';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateCategory: async (id, categoryInput) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/api/categories/${id}`, categoryInput);
      const updatedCategories = get().categories.map(cat => 
        cat.id === id ? { ...cat, ...categoryInput } : cat
      );
      set({ categories: updatedCategories, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengupdate kategori';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/categories/${id}`);
      const filteredCategories = get().categories.filter(cat => cat.id !== id);
      set({ categories: filteredCategories, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus kategori';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useCategoryStore;
