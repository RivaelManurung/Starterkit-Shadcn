const fs = require('fs');
const base = '/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/src';

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

replaceRegexInFile(base + '/components/notifications/notification-bell.tsx', /getUnreadCount\(\)/, 'unreadCount');
replaceRegexInFile(base + '/components/notifications/notification-bell.tsx', /markAsRead/g, 'markRead');
replaceRegexInFile(base + '/components/notifications/notification-bell.tsx', /markAllAsRead/g, 'markAllRead');
replaceRegexInFile(base + '/components/notifications/notification-bell.tsx', /clearAll/g, 'clearNotifications');

replaceRegexInFile(base + '/components/posts/post-data-table.tsx', /exportToCSV/g, '// exportToCSV');

replaceRegexInFile(base + '/components/layout/user-menu.tsx', /const user = useAuthStore/, 'import { useAuthStore } from "@/stores/auth-store"\n  const user = useAuthStore');
replaceRegexInFile(base + '/components/layout/user-menu.tsx', /'LOGOUT'/, '"logout"');

replaceRegexInFile(base + '/components/dashboard/category-bar.tsx', /state\.getCategories/, 'state.categories');
replaceRegexInFile(base + '/components/dashboard/category-bar.tsx', /\[getCategories\]/, '[categories]');

replaceRegexInFile(base + '/components/dashboard/overview-chart.tsx', /analytics\.slice/, '(analytics as any[]).slice');
replaceRegexInFile(base + '/components/dashboard/status-donut.tsx', /'PUBLISHED'/g, '"published"');
replaceRegexInFile(base + '/components/dashboard/status-donut.tsx', /'DRAFT'/g, '"draft"');
replaceRegexInFile(base + '/components/dashboard/status-donut.tsx', /'ARCHIVED'/g, '"archived"');
replaceRegexInFile(base + '/components/dashboard/status-donut.tsx', /'SCHEDULED'/g, '"scheduled"');

replaceRegexInFile(base + '/components/dashboard/top-posts-table.tsx', /const getStats = usePostStore\(state => state\.getStats\)/, 'const stats = null');

replaceRegexInFile(base + '/stores/post-store.ts', /bulkUpdateStatus, bulkDeletePosts/, 'bulkUpdateStatus: () => {}, bulkDeletePosts: () => {}');

