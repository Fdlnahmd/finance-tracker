import React, { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import useReminderStore from '../store/reminderStore';

export default function Reminders() {
  const { reminders, fetchReminders, loading, createReminder, updateReminder, toggleReminder, deleteReminder } = useReminderStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRem, setEditingRem] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('20:00');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingRem(null);
    setTitle('');
    setMessage('');
    setTime('20:00');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (rem) => {
    setEditingRem(rem);
    setTitle(rem.title);
    setMessage(rem.message || '');
    setTime(rem.time);
    setFormError('');
    setIsModalOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Judul pengingat wajib diisi');
      return;
    }
    if (!time) {
      setFormError('Waktu pengingat wajib diisi');
      return;
    }

    const payload = { title, message, time };

    let result;
    if (editingRem) {
      result = await updateReminder(editingRem.id, payload);
    } else {
      result = await createReminder(payload);
    }

    if (result.success) {
      setIsModalOpen(false);
    } else {
      setFormError(result.message || 'Gagal menyimpan pengingat');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengingat ini?')) {
      await deleteReminder(id);
    }
  };

  return (
    <PageLayout title="Pengingat Keuangan">
      {/* Top Banner and Add Action */}
      <div className="bg-white dark:bg-realtime-card p-5 md:p-6 rounded-2xl border border-realtime-border dark:border-realtime-darkBorder shadow-sm mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
          <h3 className="text-lg font-extrabold text-realtime-text dark:text-realtime-darkText">Reminder Harian</h3>
          <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60">Jadwalkan alarm pencatatan otomatis di HP/Browser Anda</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-sm flex items-center justify-center text-sm active:scale-[0.99] transition-all w-full sm:w-auto"
        >
          ➕ Pengingat Baru
        </button>
      </div>

      {loading && reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-12 h-12 border-4 border-realtime-border dark:border-realtime-darkBorder border-t-primary-500 rounded-full animate-spin" />
          <p className="text-sm text-realtime-text/50 dark:text-realtime-darkText/50 font-semibold">Memuat jadwal pengingat...</p>
        </div>
      ) : reminders.length === 0 ? (
        <div className="bg-white dark:bg-realtime-card p-10 rounded-2xl border border-realtime-border dark:border-realtime-darkBorder shadow-sm text-center max-w-md mx-auto">
          <span className="text-6xl block mb-4">🔔</span>
          <h4 className="font-extrabold text-realtime-text dark:text-realtime-darkText">Belum Ada Pengingat</h4>
          <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60 mt-2 leading-relaxed">
            Mencatat keuangan lebih konsisten dengan menjadwalkan alarm pengingat harian. Klik "Pengingat Baru" untuk memulai!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-6 rounded-2xl border shadow-sm transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                rem.is_active
                  ? 'bg-white dark:bg-realtime-card border-realtime-border dark:border-realtime-darkBorder hover:shadow-md'
                  : 'bg-primary-50/10 dark:bg-realtime-darkBg/40 border-realtime-border/40 dark:border-realtime-darkBorder/40 opacity-70'
              }`}
            >
              <div>
                {/* Time Badge and Switch */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-bold text-primary-500 dark:text-primary-300 tracking-tight bg-primary-50 dark:bg-primary-950/20 px-3 py-1 rounded-xl border border-primary-100/10 dark:border-primary-900/10">
                    ⏰ {rem.time}
                  </span>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      rem.is_active ? 'bg-primary-500' : 'bg-primary-100 dark:bg-realtime-darkBorder'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
                        rem.is_active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <h4 className="text-base font-extrabold text-realtime-text dark:text-realtime-darkText mb-1.5">{rem.title}</h4>
                <p className="text-xs text-realtime-text/60 dark:text-realtime-darkText/60 leading-relaxed italic mb-6">
                  {rem.message || 'Tidak ada pesan khusus'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-realtime-border/40 dark:border-realtime-darkBorder/40">
                <span className="text-[10px] text-realtime-text/40 dark:text-realtime-darkText/40 font-bold">
                  🔔 Pengingat Aktif
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEdit(rem)}
                    className="p-1.5 rounded-lg text-xs font-bold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                    title="Ubah"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(rem.id)}
                    className="p-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reminder Creation/Edition Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-realtime-text/45 dark:bg-black/60 backdrop-blur-[2px] z-40"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] md:max-w-md bg-white dark:bg-realtime-card rounded-2xl shadow-xl border border-realtime-border dark:border-realtime-darkBorder z-50 p-6 md:p-8 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-realtime-text dark:text-realtime-darkText">
                {editingRem ? '✏️ Edit Pengingat' : '➕ Pengingat Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 text-realtime-text/60 dark:text-realtime-darkText/60"
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
              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-realtime-text/75 dark:text-realtime-darkText/75 mb-1.5 uppercase tracking-wider">
                  Judul Alarm Pengingat
                </label>
                <input
                  type="text"
                  required
                  maxLength="40"
                  className="w-full px-4 py-2.5 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-realtime-text dark:text-realtime-darkText placeholder-realtime-text/40 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold text-sm"
                  placeholder="Contoh: Alarm Catat Belanja Malam"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-xs font-bold text-realtime-text/75 dark:text-realtime-darkText/75 mb-1.5 uppercase tracking-wider">
                  Waktu Harian (Jam & Menit)
                </label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-realtime-text dark:text-realtime-darkText font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              {/* Message text field */}
              <div>
                <label className="block text-xs font-bold text-realtime-text/75 dark:text-realtime-darkText/75 mb-1.5 uppercase tracking-wider">
                  Pesan Notifikasi
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-realtime-border dark:border-realtime-darkBorder bg-white dark:bg-realtime-darkBg text-realtime-text dark:text-realtime-darkText placeholder-realtime-text/40 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium"
                  placeholder="Yuk catat pengeluaran jajan malam ini agar limit saldo aman!"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-sm active:scale-[0.99] transition-all text-sm flex items-center justify-center"
              >
                💾 Jadwalkan Alarm
              </button>
            </form>
          </div>
        </>
      )}
    </PageLayout>
  );
}
