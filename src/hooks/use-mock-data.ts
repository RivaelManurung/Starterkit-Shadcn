import { usePostStore } from "@/stores/post-store";
import { useCategoryStore } from "@/stores/category-store";
import { useTagStore } from "@/stores/tag-store";
import { useUserStore } from "@/stores/user-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useActivityStore } from "@/stores/activity-store";
import { useSettingsStore } from "@/stores/settings-store";
// import { analyticsData } from "@/lib/mock/data/analytics-data";

export function useMockData() {
  const posts = usePostStore(state => state.posts);
  const categories = useCategoryStore(state => state.categories);
  const tags = useTagStore(state => state.tags);
  const users = useUserStore(state => state.users);
  const notifications = useNotificationStore(state => state.notifications);
  const activities = useActivityStore(state => state.logs);
  const settings = useSettingsStore(state => state);

  return {
    posts,
    categories,
    tags,
    users,
    notifications,
    activities,
    settings,
    analytics: Array.from({ length: 30 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return {
        date: d.toISOString(),
        views: Math.floor(Math.random() * 5000) + 1000,
        visitors: Math.floor(Math.random() * 3000) + 500,
        engagementRate: Math.floor(Math.random() * 40) + 20,
        sources: {
          direct: Math.floor(Math.random() * 1000),
          social: Math.floor(Math.random() * 1000),
          search: Math.floor(Math.random() * 1000),
          referral: Math.floor(Math.random() * 1000),
        }
      }
    }),
  };
}
