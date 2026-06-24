import { usePostStore } from '@/store/post-store';
import { useCategoryStore } from '@/store/category-store';
import { useTagStore } from '@/store/tag-store';
import { useUserStore } from '@/store/user-store';
import { useNotificationStore } from '@/store/notification-store';
import { useActivityStore } from '@/store/activity-store';
import { useSettingsStore } from '@/store/settings-store';
import { analyticsData } from '@/lib/mock/data/analytics-data';

export function useMockData() {
  const posts = usePostStore(state => state.posts);
  const categories = useCategoryStore(state => state.categories);
  const tags = useTagStore(state => state.tags);
  const users = useUserStore(state => state.users);
  const notifications = useNotificationStore(state => state.notifications);
  const activities = useActivityStore(state => state.logs);
  const settings = useSettingsStore(state => state.settings);

  return {
    posts,
    categories,
    tags,
    users,
    notifications,
    activities,
    settings,
    analytics: analyticsData,
  };
}
