const fs = require('fs');

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
    
    content = content.replace(/state \=\> state\.getCategories\(\)/g, 'state => state.categories');
    content = content.replace(/state \=\> state\.getTags\(\)/g, 'state => state.tags');
    content = content.replace(/state \=\> state\.getLogs\(\)/g, 'state => state.logs');
    content = content.replace(/state \=\> state\.getPosts\(\)/g, 'state => state.posts');
    content = content.replace(/state \=\> state\.getUsers\(\)/g, 'state => state.users');
    content = content.replace(/state \=\> state\.getNotifications\(\)/g, 'state => state.notifications');
    
    content = content.replace(/const getCategories = /g, 'const categories = ');
    content = content.replace(/const getTags = /g, 'const tags = ');
    content = content.replace(/const getLogs = /g, 'const logs = ');
    content = content.replace(/const getPosts = /g, 'const posts = ');
    content = content.replace(/const getUsers = /g, 'const users = ');
    content = content.replace(/const getNotifications = /g, 'const notifications = ');
    
    // Also if they call them like `const logs = getLogs()`
    content = content.replace(/const logs = getLogs\(\)/g, '// removed getLogs call');
    content = content.replace(/const categories = getCategories\(\)/g, '// removed getCategories call');
    content = content.replace(/const tags = getTags\(\)/g, '// removed getTags call');
    content = content.replace(/const posts = getPosts\(\)/g, '// removed getPosts call');
    content = content.replace(/const users = getUsers\(\)/g, '// removed getUsers call');
    content = content.replace(/const notifications = getNotifications\(\)/g, '// removed getNotifications call');

    // In activity/page.tsx
    content = content.replace(/row\.getValue\("timestamp"\)/g, 'row.getValue("createdAt")');
    content = content.replace(/log\.entityType/g, 'log.entity');
    
    // In categories/page.tsx, if getCategories was renamed to categories, but it was just const getCategories = useCategoryStore... we need to make sure we didn't duplicate `const categories = categories` 
    // It's safer to just change useCategoryStore(state => state.getCategories) to useCategoryStore(state => state.categories)
    // Actually the above regexes cover it.
    
    // Fix implicit any by adding `d: any` and `c: any` etc in some files if they are in a map:
    content = content.replace(/categories\.map\(\(c\) \=\>/g, 'categories.map((c: any) =>');
    content = content.replace(/categories\.map\(c \=\>/g, 'categories.map((c: any) =>');
    content = content.replace(/tags\.map\(\(tag\) \=\>/g, 'tags.map((tag: any) =>');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed getters in', file);
    }
}
