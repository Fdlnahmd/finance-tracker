import { useEffect, useCallback } from 'react';
import useReminderStore from '../store/reminderStore';

export default function useNotification() {
  const { reminders } = useReminderStore();

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('✅ Service Worker registered', reg.scope))
        .catch((err) => console.error('❌ SW registration failed', err));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Custom function to trigger a notification
  const triggerNotification = useCallback((title, body) => {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Send a postMessage to service worker or trigger native notification
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, {
            body: body,
            icon: '/favicon.ico',
            vibrate: [200, 100, 200]
          });
        });
      } else {
        new Notification(title, {
          body: body,
          icon: '/favicon.ico'
        });
      }
    }
  }, []);

  // Monitor reminders in frontend for real-time trigger if tab is open
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      reminders.forEach((reminder) => {
        if (reminder.is_active && reminder.time === currentTimeString) {
          triggerNotification(
            reminder.title,
            reminder.message || 'Waktunya mencatat transaksi keuangan Anda!'
          );
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders, triggerNotification]);

  return { requestPermission, triggerNotification };
}
