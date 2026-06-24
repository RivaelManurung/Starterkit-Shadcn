import { Notification, NotifType } from '@/types';
import { generateId } from '../utils';

const generateNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  const types: NotifType[] = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'];
  const titles = [
    'Sistem Diperbarui',
    'Artikel Berhasil Dipublikasikan',
    'Percobaan Login Gagal',
    'Database Error',
    'Pengguna Baru Terdaftar',
    'Komentar Baru',
  ];

  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const type = types[i % types.length];
    const isRead = i >= 8; // 8 pertama unread (false), sisanya read (true)
    const date = new Date(now.getTime() - i * 1000 * 60 * 60 * 5); // mundur 5 jam setiap notif

    notifications.push({
      id: generateId(),
      type,
      title: titles[i % titles.length],
      message: `Ini adalah deskripsi detail untuk notifikasi ke-${i + 1}.`,
      isRead,
      link: type === 'SUCCESS' ? '/posts' : undefined,
      createdAt: date.toISOString(),
    });
  }

  return notifications;
};

export const notificationsData: Notification[] = generateNotifications();
