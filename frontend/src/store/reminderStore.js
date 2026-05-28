import { create } from 'zustand';
import api from '../api/axios';

const useReminderStore = create((set, get) => ({
  reminders: [],
  loading: false,
  error: null,

  fetchReminders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/reminders');
      set({ reminders: response.data.data || [], loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat pengingat', loading: false });
    }
  },

  createReminder: async (reminderInput) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/reminders', reminderInput);
      set({ 
        reminders: [...get().reminders, response.data.data],
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal membuat pengingat';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateReminder: async (id, reminderInput) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/api/reminders/${id}`, reminderInput);
      const updated = get().reminders.map(rem => 
        rem.id === id ? { ...rem, ...reminderInput } : rem
      );
      set({ reminders: updated, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengupdate pengingat';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  toggleReminder: async (id) => {
    try {
      await api.patch(`/api/reminders/${id}/toggle`);
      const updated = get().reminders.map(rem => 
        rem.id === id ? { ...rem, is_active: !rem.is_active } : rem
      );
      set({ reminders: updated });
      return { success: true };
    } catch (error) {
      console.error('Failed to toggle reminder:', error);
      return { success: false };
    }
  },

  deleteReminder: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/reminders/${id}`);
      set({ 
        reminders: get().reminders.filter(rem => rem.id !== id),
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal menghapus pengingat';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  }
}));

export default useReminderStore;
