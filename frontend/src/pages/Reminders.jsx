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
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm mb-6 lg:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Reminder Harian</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Jadwalkan alarm pencatatan otomatis di HP/Browser Anda</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold shadow-lg shadow-sky-500/20 flex items-center justify-center text-sm active:scale-98 transition-all w-full sm:w-auto"
        >
          ➕ Pengingat Baru
        </button>
      </div>

      {loading && reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-12 h-12 border-4 border-gray-100 dark:border-gray-700 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-bold">Memuat jadwal pengingat...</p>
        </div>
      ) : reminders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm text-center max-w-md mx-auto">
          <span className="text-6xl block mb-4">🔔</span>
          <h4 className="font-extrabold text-gray-700 dark:text-gray-300">Belum Ada Pengingat</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Mencatat keuangan lebih konsisten dengan menjadwalkan alarm pengingat harian. Klik "Pengingat Baru" untuk memulai!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-6 rounded-3xl border shadow-sm transition-all duration-150 relative overflow-hidden flex flex-col justify-between ${
                rem.is_active
                  ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/50 hover:shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 opacity-75'
              }`}
            >
              <div>
                {/* Time Badge and Switch */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-black text-sky-500 tracking-tight bg-sky-50 dark:bg-sky-950/20 px-3 py-1 rounded-xl">
                    ⏰ {rem.time}
                  </span>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      rem.is_active ? 'bg-sky-500' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform ${
                        rem.is_active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <h4 className="text-base font-extrabold text-gray-900 dark:text-white mb-1.5">{rem.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic mb-6">
                  {rem.message || 'Tidak ada pesan khusus'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-700/30">
                <span className="text-[10px] text-gray-400 font-bold">
                  🔔 Pengingat Aktif
                </span>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEdit(rem)}
                    className="p-1.5 rounded-lg text-xs font-bold text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20"
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
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-md bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                {editingRem ? '✏️ Edit Pengingat' : '➕ Pengingat Baru'}
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
              {/* Title Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Judul Alarm Pengingat
                </label>
                <input
                  type="text"
                  required
                  maxLength="40"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-bold"
                  placeholder="Contoh: Alarm Catat Belanja Malam"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Time Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Waktu Harian (Jam & Menit)
                </label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-lg"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              {/* Message text field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Pesan Notifikasi
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-sm"
                  placeholder="Yuk catat pengeluaran jajan malam ini agar limit saldo aman!"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold shadow-lg shadow-sky-500/25 active:scale-98 transition-all text-sm flex items-center justify-center"
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
