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
    
    // Fix imports for stores: @/store/X or @/stores/X -> @/stores/X (without use-)
    content = content.replace(/from\s+["']@\/stores?\/(use-)?([^"']+)["']/g, (match, p1, p2) => {
        changed = true;
        return `from "@/stores/${p2}"`;
    });
    
    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Fixed imports in', file);
    }
}
