import { usePostStore } from "@/stores/post-store";
import { useCategoryStore } from "@/stores/category-store";
import { useTagStore } from "@/stores/tag-store";
import { useUserStore } from "@/stores/user-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useActivityStore } from "@/stores/activity-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useMemo } from "react";

// Seed-based pseudo-random for stable mock data
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function useMockData() {
  const posts = usePostStore(state => state.posts);
  const categories = useCategoryStore(state => state.categories);
  const tags = useTagStore(state => state.tags);
  const users = useUserStore(state => state.users);
  const notifications = useNotificationStore(state => state.notifications);
  const activities = useActivityStore(state => state.logs);
  const settings = useSettingsStore(state => state);

  const analytics = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (29 - i))
      return {
        date: d.toISOString(),
        views: Math.floor(seededRandom(i * 7 + 1) * 5000) + 1000,
        visitors: Math.floor(seededRandom(i * 7 + 2) * 3000) + 500,
        engagementRate: Math.floor(seededRandom(i * 7 + 3) * 40) + 20,
        sources: {
          direct: Math.floor(seededRandom(i * 7 + 4) * 1000),
          social: Math.floor(seededRandom(i * 7 + 5) * 1000),
          search: Math.floor(seededRandom(i * 7 + 6) * 1000),
          referral: Math.floor(seededRandom(i * 7 + 7) * 1000),
        }
      }
    })
  }, []);

  return {
    posts,
    categories,
    tags,
    users,
    notifications,
    activities,
    settings,
    analytics,
  };
}
