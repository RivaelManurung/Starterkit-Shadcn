import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, PostFilters, PaginatedResult, DashboardStats, PostStatus } from '@/types';
import { postsData } from '@/lib/mock/data/posts-data';
import { generateId, generateSlug } from '@/lib/mock/utils';
import { useActivityStore } from './activity-store';
import { useNotificationStore } from './notification-store';
import { useUserStore } from './user-store';
import { useCategoryStore } from './category-store';
import { useTagStore } from './tag-store';
import { useSettingsStore } from './settings-store';

interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  status: PostStatus;
  categoryId: string;
  tagIds: string[];
  authorId: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface UpdatePostInput extends Partial<CreatePostInput> {}

interface PostState {
  posts: Post[];
  filters: PostFilters;

  getPosts: (overrideFilters?: Partial<PostFilters>) => PaginatedResult<Post>;
  getPost: (id: string) => Post | undefined;
  getPostBySlug: (slug: string) => Post | undefined;
  getStats: () => DashboardStats;

  createPost: (data: CreatePostInput) => Post;
  updatePost: (id: string, data: UpdatePostInput) => Post | undefined;
  deletePost: (id: string) => boolean;
  bulkDeletePosts: (ids: string[]) => number;
  bulkUpdateStatus: (ids: string[], status: PostStatus) => number;
  incrementView: (id: string) => void;

  setFilters: (filters: Partial<PostFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: PostFilters = {
  search: '',
  status: 'ALL',
  categoryId: null,
  tagIds: [],
  authorId: null,
  dateFrom: null,
  dateTo: null,
  sort: 'newest',
  page: 1,
  limit: 10,
};

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: postsData,
      filters: defaultFilters,

      getPosts: (overrideFilters) => {
        const state = get();
        const filters = { ...state.filters, ...overrideFilters };
        let filtered = [...state.posts];

        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title.toLowerCase().includes(search) ||
              p.content.toLowerCase().includes(search) ||
              p.excerpt.toLowerCase().includes(search)
          );
        }

        if (filters.status !== 'ALL') {
          filtered = filtered.filter((p) => p.status === filters.status);
        }

        if (filters.categoryId) {
          filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
        }

        if (filters.tagIds.length > 0) {
          filtered = filtered.filter((p) =>
            filters.tagIds.every((tagId) => p.tagIds.includes(tagId))
          );
        }

        if (filters.authorId) {
          filtered = filtered.filter((p) => p.authorId === filters.authorId);
        }

        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom).getTime();
          filtered = filtered.filter((p) => new Date(p.createdAt).getTime() >= from);
        }

        if (filters.dateTo) {
          const to = new Date(filters.dateTo).getTime();
          filtered = filtered.filter((p) => new Date(p.createdAt).getTime() <= to);
        }

        filtered.sort((a, b) => {
          switch (filters.sort) {
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'most-viewed':
              return b.viewCount - a.viewCount;
            case 'alphabetical':
              return a.title.localeCompare(b.title);
            case 'newest':
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });

        const total = filtered.length;
        const totalPages = Math.ceil(total / filters.limit);
        const startIndex = (filters.page - 1) * filters.limit;
        const endIndex = startIndex + filters.limit;
        const paginatedData = filtered.slice(startIndex, endIndex);

        // Populate relationships for the paginated view
        const data = paginatedData.map((p) => ({
          ...p,
          category: useCategoryStore.getState().getCategory(p.categoryId),
          author: useUserStore.getState().getUser(p.authorId),
          tags: p.tagIds.map((id) => useTagStore.getState().getTag(id)).filter(Boolean) as any,
        }));

        return {
          data,
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages,
          hasNextPage: filters.page < totalPages,
          hasPrevPage: filters.page > 1,
        };
      },

      getPost: (id) => {
        const post = get().posts.find((p) => p.id === id);
        if (!post) return undefined;
        return {
          ...post,
          category: useCategoryStore.getState().getCategory(post.categoryId),
          author: useUserStore.getState().getUser(post.authorId),
          tags: post.tagIds.map((tid) => useTagStore.getState().getTag(tid)).filter(Boolean) as any,
        };
      },

      getPostBySlug: (slug) => {
        const post = get().posts.find((p) => p.slug === slug);
        if (!post) return undefined;
        return {
          ...post,
          category: useCategoryStore.getState().getCategory(post.categoryId),
          author: useUserStore.getState().getUser(post.authorId),
          tags: post.tagIds.map((tid) => useTagStore.getState().getTag(tid)).filter(Boolean) as any,
        };
      },

      getStats: () => {
        const posts = get().posts;
        const totalPosts = posts.length;
        let publishedPosts = 0;
        let draftPosts = 0;
        let archivedPosts = 0;
        let scheduledPosts = 0;
        let totalViews = 0;

        posts.forEach((p) => {
          totalViews += p.viewCount;
          if (p.status === 'PUBLISHED') publishedPosts++;
          else if (p.status === 'DRAFT') draftPosts++;
          else if (p.status === 'ARCHIVED') archivedPosts++;
          else if (p.status === 'SCHEDULED') scheduledPosts++;
        });

        const sortedByViews = [...posts].sort((a, b) => b.viewCount - a.viewCount);
        const sortedByDate = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {
          totalPosts,
          publishedPosts,
          draftPosts,
          archivedPosts,
          scheduledPosts,
          totalViews,
          totalCategories: useCategoryStore.getState().categories.length,
          totalTags: useTagStore.getState().tags.length,
          totalUsers: useUserStore.getState().users.length,
          viewsTrend: 12.5, // Mock data
          postsTrend: 5.2, // Mock data
          recentPosts: sortedByDate.slice(0, 5),
          topPosts: sortedByViews.slice(0, 5),
        };
      },

      createPost: (data) => {
        const now = new Date().toISOString();
        const readingTimeMin = Math.max(1, Math.ceil(data.content.length / 1000)); // Rough estimate
        const currentUser = useSettingsStore.getState().getCurrentUser();

        const newPost: Post = {
          ...data,
          id: generateId(),
          viewCount: 0,
          readingTimeMin,
          createdAt: now,
          updatedAt: now,
          publishedAt: data.status === 'PUBLISHED' ? now : undefined,
        };

        set((state) => ({ posts: [newPost, ...state.posts] }));

        useUserStore.getState().incrementPostCount(data.authorId);
        useCategoryStore.getState().incrementPostCount(data.categoryId);
        data.tagIds.forEach(id => useTagStore.getState().incrementPostCount(id));

        useActivityStore.getState().addLog({
          action: 'POST_CREATED',
          userId: currentUser?.id || 'system',
          entityId: newPost.id,
          entityType: 'Post',
          entityTitle: newPost.title,
        });

        useNotificationStore.getState().addNotification({
          type: 'SUCCESS',
          title: 'Artikel Dibuat',
          message: `Artikel "${newPost.title}" telah dibuat.`,
          link: `/posts/${newPost.id}`,
        });

        return newPost;
      },

      updatePost: (id, data) => {
        const oldPost = get().posts.find((p) => p.id === id);
        if (!oldPost) return undefined;

        const now = new Date().toISOString();
        const readingTimeMin = data.content ? Math.max(1, Math.ceil(data.content.length / 1000)) : oldPost.readingTimeMin;
        const currentUser = useSettingsStore.getState().getCurrentUser();

        let publishedAt = oldPost.publishedAt;
        if (data.status === 'PUBLISHED' && oldPost.status !== 'PUBLISHED') {
          publishedAt = now;
        }

        const updatedPost = {
          ...oldPost,
          ...data,
          readingTimeMin,
          updatedAt: now,
          publishedAt,
        };

        // Handle category change post counts
        if (data.categoryId && data.categoryId !== oldPost.categoryId) {
          useCategoryStore.getState().decrementPostCount(oldPost.categoryId);
          useCategoryStore.getState().incrementPostCount(data.categoryId);
        }

        // Handle tags change post counts
        if (data.tagIds) {
          const removedTags = oldPost.tagIds.filter(t => !data.tagIds!.includes(t));
          const addedTags = data.tagIds.filter(t => !oldPost.tagIds.includes(t));
          removedTags.forEach(tId => useTagStore.getState().decrementPostCount(tId));
          addedTags.forEach(tId => useTagStore.getState().incrementPostCount(tId));
        }

        // Handle author change
        if (data.authorId && data.authorId !== oldPost.authorId) {
          useUserStore.getState().decrementPostCount(oldPost.authorId);
          useUserStore.getState().incrementPostCount(data.authorId);
        }

        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
        }));

        let action: any = 'POST_UPDATED';
        if (data.status === 'PUBLISHED' && oldPost.status !== 'PUBLISHED') action = 'POST_PUBLISHED';

        useActivityStore.getState().addLog({
          action,
          userId: currentUser?.id || 'system',
          entityId: id,
          entityType: 'Post',
          entityTitle: updatedPost.title,
          meta: data.status !== oldPost.status ? { before: oldPost.status, after: data.status } : undefined,
        });

        return updatedPost;
      },

      deletePost: (id) => {
        const post = get().posts.find((p) => p.id === id);
        if (!post) return false;

        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        }));

        useUserStore.getState().decrementPostCount(post.authorId);
        useCategoryStore.getState().decrementPostCount(post.categoryId);
        post.tagIds.forEach(tId => useTagStore.getState().decrementPostCount(tId));

        const currentUser = useSettingsStore.getState().getCurrentUser();

        useActivityStore.getState().addLog({
          action: 'POST_DELETED',
          userId: currentUser?.id || 'system',
          entityId: id,
          entityType: 'Post',
          entityTitle: post.title,
        });

        useNotificationStore.getState().addNotification({
          type: 'INFO',
          title: 'Artikel Dihapus',
          message: `Artikel "${post.title}" telah dihapus.`,
        });

        return true;
      },

      bulkDeletePosts: (ids) => {
        let count = 0;
        ids.forEach(id => {
          if (get().deletePost(id)) count++;
        });
        return count;
      },

      bulkUpdateStatus: (ids, status) => {
        let count = 0;
        ids.forEach(id => {
          if (get().updatePost(id, { status })) count++;
        });
        return count;
      },

      incrementView: (id) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p
          ),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },
    }),
    {
      name: 'dsk-post-storage',
      skipHydration: true,
    }
  )
);
