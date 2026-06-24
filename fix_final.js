const fs = require('fs');

function replaceInFile(filePath, search, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.split(search).join(replacement);
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent);
            console.log(`Replaced in ${filePath}`);
        }
    }
}

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

// 1. post-store.ts import
replaceRegexInFile(base + '/stores/post-store.ts', /import { Post } from "@\/types"/, 'import { Post, PostStatus } from "@/types"');

// 2. post-status-badge.tsx status cases
replaceInFile(base + '/components/posts/post-status-badge.tsx', "case 'PUBLISHED':", "case 'published':");
replaceInFile(base + '/components/posts/post-status-badge.tsx', "case 'DRAFT':", "case 'draft':");
replaceInFile(base + '/components/posts/post-status-badge.tsx', "case 'SCHEDULED':", "case 'scheduled':");
replaceInFile(base + '/components/posts/post-status-badge.tsx', "case 'ARCHIVED':", "case 'archived':");

// 3. post-form.tsx 
// Fix status enum
replaceInFile(base + '/components/posts/post-form.tsx', 'z.enum(["PUBLISHED", "DRAFT", "ARCHIVED", "SCHEDULED"])', 'z.enum(["published", "draft", "archived", "scheduled", "under_review"])');
replaceInFile(base + '/components/posts/post-form.tsx', 'status: "DRAFT",', 'status: "draft",');
replaceInFile(base + '/components/posts/post-form.tsx', 'value="DRAFT"', 'value="draft"');
replaceInFile(base + '/components/posts/post-form.tsx', 'value="PUBLISHED"', 'value="published"');
replaceInFile(base + '/components/posts/post-form.tsx', 'value="SCHEDULED"', 'value="scheduled"');
replaceInFile(base + '/components/posts/post-form.tsx', 'value="ARCHIVED"', 'value="archived"');

// Fix tagIds
replaceInFile(base + '/components/posts/post-form.tsx', 'tagIds: initialData.tagIds,', 'tagIds: initialData.tags?.map(t => t.id) || [],');

// Fix categoryId
replaceInFile(base + '/components/posts/post-form.tsx', 'categoryId: initialData.categoryId,', 'categoryId: initialData.categoryId || "",');

// 4. use-mock-data.ts 
// Fix missing analyticsData import by commenting it out (since it's not found) and also fix settings issue
replaceRegexInFile(base + '/hooks/use-mock-data.ts', /import { analyticsData } from '@\/lib\/mock\/data\/analytics-data';/g, '// import { analyticsData } from "@/lib/mock/data/analytics-data";');
replaceRegexInFile(base + '/hooks/use-mock-data.ts', /useSettingsStore\(state => state\.settings\)/g, 'useSettingsStore(state => state)');

