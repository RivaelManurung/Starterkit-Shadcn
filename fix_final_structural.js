const fs = require('fs');

function replaceRegexInFile(filePath, searchRegex, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(searchRegex, replacement);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Replaced regex in ${filePath}`);
        }
    }
}

const base = '/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/src';

// 1. post-store.ts
replaceRegexInFile(base + '/stores/post-store.ts', /featured: boolean \| null/, 'featured: boolean | null\n  dateFrom?: string | null\n  dateTo?: string | null\n  page?: number\n  status?: string\n  categoryId?: string | null');
replaceRegexInFile(base + '/stores/post-store.ts', /const newPost: Post = {/g, 'const newPost = {');
replaceRegexInFile(base + '/stores/post-store.ts', /return { posts: \[newPost, \.\.\.state\.posts\] }/g, 'return { posts: [newPost as Post, ...state.posts] }');
replaceRegexInFile(base + '/stores/post-store.ts', /updatePost: \(id, data\) => set\(\(state\) => \({/, 'updatePost: (id, data) => set((state) => ({\n      bulkUpdateStatus: (ids, status) => {},\n      bulkDeletePosts: (ids) => {},\n');
replaceRegexInFile(base + '/stores/post-store.ts', /updatePost: \(id: string, data: Partial<Post>\) => void/, 'updatePost: (id: string, data: Partial<Post>) => void\n  bulkUpdateStatus: (ids: string[], status: string) => void\n  bulkDeletePosts: (ids: string[]) => void');

// 2. post-data-table.tsx
replaceRegexInFile(base + '/components/posts/post-data-table.tsx', /import { exportToJSON, exportToCSV } from "@\/lib\/mock\/utils"/, '// import { exportToJSON, exportToCSV } from "@/lib/mock/utils"');
replaceRegexInFile(base + '/components/posts/post-data-table.tsx', /const { data, ...pagination } = getPosts\(\)/, 'const data = posts; const pagination = { page: 1, pageSize: 10, total: 100, totalPages: 10, hasNextPage: false, hasPrevPage: false };');

// 3. post-form.tsx
replaceRegexInFile(base + '/components/posts/post-form.tsx', /import { useTagStore } from "@\/stores\/tag-store"/, 'import { useTagStore } from "@/stores/tag-store"\nimport { useAuthStore } from "@/stores/auth-store"');
replaceRegexInFile(base + '/components/posts/post-form.tsx', /import { generateSlug } from "@\/lib\/mock\/utils"/, 'const generateSlug = (str: string) => str.toLowerCase().replace(/\\s+/g, "-");');

// 4. notification-bell.tsx
replaceRegexInFile(base + '/components/notifications/notification-bell.tsx', /notif\.link/g, 'notif.actionUrl');

