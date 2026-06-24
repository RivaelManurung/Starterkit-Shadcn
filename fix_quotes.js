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
    
    // Fix router.push('/dashboard/route") -> router.push("/dashboard/route")
    content = content.replace(/router\.push\('\/dashboard\/([a-zA-Z0-9_-]+)"\)/g, 'router.push("/dashboard/$1")');
    // Fix router.push("/dashboard/route') -> router.push("/dashboard/$1")
    content = content.replace(/router\.push\("\/dashboard\/([a-zA-Z0-9_-]+)'\)/g, 'router.push("/dashboard/$1")');
    
    // Fix router.push('/dashboard/route/...')
    content = content.replace(/router\.push\('\/dashboard\/([a-zA-Z0-9_/-]+)"\)/g, 'router.push("/dashboard/$1")');
    content = content.replace(/router\.push\("\/dashboard\/([a-zA-Z0-9_/-]+)'\)/g, 'router.push("/dashboard/$1")');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed quotes in', file);
    }
}
