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
    let changed = false;
    
    // Fix UserRole -> Role
    if (content.includes('UserRole')) {
        content = content.replace(/UserRole/g, 'Role');
        changed = true;
    }
    
    // Fix PostStatus
    if (content.includes('PostStatus')) {
        content = content.replace(/PostStatus/g, 'Post["status"]');
        changed = true;
    }

    // Fix getCurrentUser()
    if (content.includes('getCurrentUser()') || content.includes('getCurrentUser')) {
        content = content.replace(/useSettingsStore\(\s*\(?state\)?\s*=>\s*state\.getCurrentUser\(\)\s*\)/g, 'useAuthStore(state => state.currentUser)');
        content = content.replace(/useSettingsStore\(\s*state\s*=>\s*state\.currentUser\s*\)/g, 'useAuthStore(state => state.currentUser)');
        // Ensure auth-store is imported if we just added it
        if (!content.includes('useAuthStore')) {
             content = content.replace(/import { useSettingsStore } from ["']@\/stores\/settings-store["']/g, 'import { useSettingsStore } from "@/stores/settings-store"\nimport { useAuthStore } from "@/stores/auth-store"');
        }
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed types in', file);
    }
}
