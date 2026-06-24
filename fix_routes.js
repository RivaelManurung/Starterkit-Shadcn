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

const dashboardRoutes = [
    'overview',
    'analytics',
    'posts',
    'categories',
    'tags',
    'users',
    'notifications',
    'activity',
    'activity-logs',
    'settings',
    'help' // Assuming help is also meant to be inside or handled. Actually, there's no /help folder but sidebar has it.
];

const files = walk('/home/rivael/Documents/Free/Next/StarterkitDashboardShadcn/src');
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace href="/..." with href="/dashboard/..."
    dashboardRoutes.forEach(route => {
        // Match exact href="/route" or href="/route/..." 
        const regex1 = new RegExp(`href="\\/${route}([/"])`, 'g');
        content = content.replace(regex1, `href="/dashboard/${route}$1`);
        
        // Also match router.push('/route...')
        const regex2 = new RegExp(`router\\.push\\(['"]\\/${route}(['"\\/])`, 'g');
        content = content.replace(regex2, `router.push('/dashboard/${route}$1`);
    });
    
    // Special fix for sidebar where url is not inside href="" initially but as a prop object
    // url: "/overview" -> url: "/dashboard/overview"
    dashboardRoutes.forEach(route => {
        const regex3 = new RegExp(`url:\\s*["']\\/${route}([/"])`, 'g');
        content = content.replace(regex3, `url: "/dashboard/${route}$1`);
    });
    
    // Fix activity-logs to activity in sidebar
    content = content.replace(/url: "\/dashboard\/activity-logs"/g, 'url: "/dashboard/activity"');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed routes in', file);
    }
}
