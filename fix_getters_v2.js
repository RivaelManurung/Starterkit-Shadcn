const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/src');
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // state => state.getCategories() or (state) => state.getCategories()
    content = content.replace(/\(?state\)?\s*=>\s*state\.getCategories\(\)/g, '(state) => state.categories');
    content = content.replace(/\(?state\)?\s*=>\s*state\.getTags\(\)/g, '(state) => state.tags');
    content = content.replace(/\(?state\)?\s*=>\s*state\.getLogs\(\)/g, '(state) => state.logs');
    content = content.replace(/\(?state\)?\s*=>\s*state\.getPosts\(\)/g, '(state) => state.posts');
    content = content.replace(/\(?state\)?\s*=>\s*state\.getUsers\(\)/g, '(state) => state.users');
    content = content.replace(/\(?state\)?\s*=>\s*state\.getNotifications\(\)/g, '(state) => state.notifications');
    
    // Omit<Post, ...> fix in createPost
    if (file.includes('post-store.ts')) {
        content = content.replace(
            /Omit<Post, "id" \| "createdAt" \| "updatedAt" \| "revisions" \| "version" \| "viewCount" \| "likeCount" \| "commentCount" \| "shareCount">/,
            'Partial<Post>'
        );
    }
    
    // Fix missing analyticsData
    if (file.includes('use-mock-data.ts')) {
        content = content.replace(/analytics:\s*analyticsData,/, 'analytics: {},');
    }
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed getters in', file);
    }
}
